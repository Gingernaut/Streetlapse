var GSVPANO = GSVPANO || {};
GSVPANO.MotionBlurEffect = function (parameters) {

    'use strict';

    var _parameters = parameters || {},
        _speed,
        _gl,
        _shaderPath,
        _glResources = {
            vs: null,
            fs: null,
            p: {
                id: null,
                attributes: {
                    position: null
                },
                uniforms: {
                    panorama: null,
                    depthMap: null,
                    velocity: null,
                }
            },
            tex: {
                inPano: null,
                inDepth: null,
                out: null
            },
            vb: null,
            eb: null,
            fb: null
        },
        _panoWidth, _panoHeight,
        _depthMapWidth, _depthMapHeight;

    this.run = function(panorama, depthMap, speed) {
        var self = this;

        // Init computation
        _gl.clearColor(0, 0, 0, 1);
        _gl.clear(_gl.COLOR_BUFFER_BIT);

        _gl.bindBuffer(_gl.ARRAY_BUFFER, _glResources.vb);
        _gl.useProgram(_glResources.p.id);

        _gl.vertexAttribPointer(_glResources.p.attributes.position, 4, _gl.FLOAT, false, 8*4, 0);               
        _gl.enableVertexAttribArray(_glResources.p.attributes.position);

        _gl.bindFramebuffer(_gl.FRAMEBUFFER, _glResources.fb.id);

        _gl.viewport(0, 0, _panoWidth, _panoHeight);

        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, _glResources.eb);

        // Upload panorama
        _gl.activeTexture(_gl.TEXTURE0);
        _gl.bindTexture(_gl.TEXTURE_2D, _glResources.tex.inPano.id);               
        
        var panoramaData = new Uint8Array(panorama.data.buffer, 0, _panoWidth*_panoHeight*4);
        _gl.texSubImage2D(_gl.TEXTURE_2D, 0, 0, 0, _panoWidth, _panoHeight, _gl.RGBA, _gl.UNSIGNED_BYTE, panoramaData);

        // Upload depth map
        _gl.activeTexture(_gl.TEXTURE1);
        _gl.bindTexture(_gl.TEXTURE_2D, _glResources.tex.inDepth.id);

        _gl.texSubImage2D(_gl.TEXTURE_2D, 0, 0, 0, _depthMapWidth, _depthMapHeight, _gl.LUMINANCE, _gl.FLOAT, depthMap.depthMap);

        // Compute
        _gl.drawElements(_gl.TRIANGLE_STRIP, 4, _gl.UNSIGNED_SHORT, 0);              

        // Read result from texture
        var result = self.newOutputImage(_panoWidth, _panoHeight);
        var resultData = new Uint8Array(result.imageData.data.buffer, 0, _panoWidth * _panoHeight * 4);
        _gl.readPixels(0, 0, _panoWidth, _panoHeight, _gl.RGBA, _gl.UNSIGNED_BYTE, resultData);
        result.finalize();

        // Deinit
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);

        _gl.disableVertexAttribArray(_glResources.p.attributes.position);

        return result.canvas;
    }

    this.newOutputImage = function(width, height) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext('2d');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        
        return {
            canvas: canvas,
            context: context,
            imageData: context.getImageData(0, 0, width, height),

            set : function(x, y, r, g, b) {
                this.imageData.data[4*(y*width + x)    ] = r;
                this.imageData.data[4*(y*width + x) + 1] = g;
                this.imageData.data[4*(y*width + x) + 2] = b;
                this.imageData.data[4*(y*width + x) + 3] = 255;
            },

            finalize: function() {
                this.context.putImageData(this.imageData, 0, 0);
            }
        }
    }

    this.setSpeed = function(speed) {
        _speed = speed;
    };

    this.setShaderPath = function(path) {
        _shaderPath = path;
    };

    this.init = function(panoWidth, panoHeight, depthMapWidth, depthMapHeight) {
        _panoWidth = panoWidth;
        _panoHeight = panoHeight;
        _depthMapWidth = depthMapWidth;
        _depthMapHeight = depthMapHeight;

        var glCanvas = document.createElement("canvas");
        
        _gl = this.initGL(glCanvas);
        this.initShaders();
        this.initBuffers();

        _glResources.tex.inPano = this.makeTexture4CUnsignedByte(null, panoWidth, panoHeight);
        _glResources.tex.inDepth = this.makeTexture1CFloat(null, depthMapWidth, depthMapHeight);

        _glResources.tex.out = this.makeTexture4CUnsignedByte(null, panoWidth, panoHeight);
        _glResources.fb = this.makeFramebuffer(_glResources.tex.out);

        _glResources.p.attributes.position = _gl.getAttribLocation(_glResources.p.id, "position");
        _glResources.p.uniforms.panorama = _gl.getUniformLocation(_glResources.p.id, "panorama");
        _glResources.p.uniforms.depthMap = _gl.getUniformLocation(_glResources.p.id, "depthMap");
        _glResources.p.uniforms.velocity = _gl.getUniformLocation(_glResources.p.id, "velocity");

        _gl.useProgram(_glResources.p.id);
        _gl.uniform1i(_glResources.p.uniforms.panorama, 0);
        _gl.uniform1i(_glResources.p.uniforms.depthMap, 1);
        _gl.uniform3fv(_glResources.p.uniforms.velocity, new Float32Array([_speed, 0, 0]));
    }

    ///////////////////////////////
    // BUFFERS
    ///////////////////////////////

    var _vertexBufferData = [
       //  x     y     z    w  |   r    g    b    a
        -1.0, -1.0, -3.0, 1.0,   1.0, 0.0, 0.0, 1.0,
         1.0, -1.0, -3.0, 1.0,   0.0, 1.0, 0.0, 1.0,
        -1.0,  1.0, -3.0, 1.0,   0.0, 0.0, 1.0, 1.0,
         1.0,  1.0, -3.0, 1.0,   1.0, 1.0, 0.0, 1.0
    ];
    var _elementBufferData = [
        0, 1, 2, 3
    ];

    ///////////////////////////////
    // OPENGL STUFF
    ///////////////////////////////

    this.initGL = function(canvas) {
        var gl;
        var names = [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ];
        for(var i=0; i<names.length; i++) 
        {
            try 
            {                    
                gl = canvas.getContext(names[i]);
                if (gl) { break; }
            } catch (e) {}
        }
        if(!gl) 
        {
            alert("No known OpenGL context detected! Is it enabled?");
            return;
        }
        var f = gl.getExtension("OES_texture_float");
        if(!f) 
        {
            alert("no OES_texture_float");
            return;
        }

        return gl;
    }

    this.loadShaderSource = function(filename) {
        var contents = "";
        $.ajax({
            async: false,
            url: filename,
            success: function(result) {
                contents = result;
            }
        });
        return contents;
    }

    this.initShaders = function() {
        var vertexShaderSource = this.loadShaderSource(_shaderPath + "GSVPanoEffectMotionBlur.vs");
        var fragmentShaderSource = this.loadShaderSource(_shaderPath + "GSVPanoEffectMotionBlur.fs");
        _glResources.vs = this.makeShader(_gl.VERTEX_SHADER, vertexShaderSource);
        _glResources.fs = this.makeShader(_gl.FRAGMENT_SHADER, fragmentShaderSource);
        _glResources.p.id = this.makeProgram(_glResources.vs, _glResources.fs);
    }

    this.initBuffers = function() {
        _glResources.vb = makeBuffer(_gl.ARRAY_BUFFER, new Float32Array(_vertexBufferData), 8, 4);
        _glResources.eb = makeBuffer(_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(_elementBufferData), 1, 4);
    }

    this.makeShader = function(type, source) {
        var shader = _gl.createShader(type);
        _gl.shaderSource(shader, source);
        _gl.compileShader(shader);
        
        var ok = _gl.getShaderParameter(shader, _gl.COMPILE_STATUS);
        if(!ok) {
            alert(_gl.getShaderInfoLog(shader));
            return null;
        }
        
        return shader;
    }
    
    this.makeProgram = function(vertexShader, fragmentShader) {
        var program = _gl.createProgram();
        _gl.attachShader(program, vertexShader);
        _gl.attachShader(program, fragmentShader);
        _gl.linkProgram(program);
        
        var ok = _gl.getProgramParameter(program, _gl.LINK_STATUS);
        if(!ok) {
            alert(_gl.getProgramInfoLog(program));
            return null;
        }
        
        return program;
    }

    function makeBuffer(target, bufferData, itemSize, numItems) {
        var buffer = _gl.createBuffer();
        _gl.bindBuffer(target, buffer);
        _gl.bufferData(target, bufferData, _gl.STATIC_DRAW);
        return buffer;
    }

    this.makeTexture1CFloat = function(data, width, height) {
        var tex = {
            id: 0,
            width: width,
            height: height
        };
        tex.id = _gl.createTexture();

        _gl.bindTexture(_gl.TEXTURE_2D, tex.id);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.LUMINANCE, width, height, 0, _gl.LUMINANCE, _gl.FLOAT, data);

        return tex;
    }

    this.makeTexture4CUnsignedByte = function(data, width, height) {
        var tex = {
            id: 0,
            width: width,
            height: height
        };
        tex.id = _gl.createTexture();

        _gl.bindTexture(_gl.TEXTURE_2D, tex.id);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, width, height, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, data);

        return tex;
    }

    this.makeFramebuffer = function(tex) {
        var fb = {
            id: 0,
        };
        
        fb.id = _gl.createFramebuffer();
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, fb.id);
        _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_2D, tex.id, 0);
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);

        return fb;
    }

    ///////////////////////////////
    // INITIALIZATION
    ///////////////////////////////

    this.setSpeed( _parameters.speed || 1 );
    this.setShaderPath( _parameters.shaderPath || "");

    this.init(_parameters.panoWidth, _parameters.panoHeight, _parameters.depthMapWidth, _parameters.depthMapHeight);
    
};
