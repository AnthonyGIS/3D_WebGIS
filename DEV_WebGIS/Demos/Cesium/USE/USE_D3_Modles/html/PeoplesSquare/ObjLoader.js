(function () {

    var requirejs, require, define;
    (function (undef) {
        var main, req, makeMap, handlers,
            defined = {},
            waiting = {},
            config = {},
            defining = {},
            hasOwn = Object.prototype.hasOwnProperty,
            aps = [].slice,
            jsSuffixRegExp = /\.js$/;

        function hasProp(obj, prop) {
            return hasOwn.call(obj, prop);
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @returns {String} normalized name
         */
        function normalize(name, baseName) {
            var nameParts, nameSegment, mapValue, foundMap, lastIndex,
                foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
                baseParts = baseName && baseName.split("/"),
                map = config.map,
                starMap = (map && map['*']) || {};

            //Adjust any relative paths.
            if (name) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // If wanting node ID compatibility, strip .js from end
                // of IDs. Have to do this here, and not in nameToUrl
                // because node allows either .js or non .js to map
                // to same file.
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                // Starts with a '.' so need the baseName
                if (name[0].charAt(0) === '.' && baseParts) {
                    //Convert baseName to array, and lop off the last part,
                    //so that . matches that 'directory' and not name of the baseName's
                    //module. For instance, baseName of 'one/two/three', maps to
                    //'one/two/three.js', but we want the directory, 'one/two' for
                    //this normalization.
                    normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    name = normalizedBaseParts.concat(name);
                }

                //start trimDots
                for (i = 0; i < name.length; i++) {
                    part = name[i];
                    if (part === '.') {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === '..') {
                        // If at the start, or previous value is still ..,
                        // keep them so that when converted to a path it may
                        // still work when converted to a path, even though
                        // as an ID it is less than ideal. In larger point
                        // releases, may be better to just kick out an error.
                        if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {

                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join('/');
            }

            //Apply map config if available.
            if ((baseParts || starMap) && map) {
                nameParts = name.split('/');

                for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join("/");

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = map[baseParts.slice(0, j).join('/')];

                            //baseName segment has  config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = mapValue[nameSegment];
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break;
                                }
                            }
                        }
                    }

                    if (foundMap) {
                        break;
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && starMap[nameSegment]) {
                        foundStarMap = starMap[nameSegment];
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            return name;
        }

        function makeRequire(relName, forceSync) {
            return function () {
                //A version of a require function that passes a moduleName
                //value for items that may need to
                //look up paths relative to the moduleName
                var args = aps.call(arguments, 0);

                //If first arg is not require('string'), and there is only
                //one arg, it is the array form without a callback. Insert
                //a null so that the following concat is correct.
                if (typeof args[0] !== 'string' && args.length === 1) {
                    args.push(null);
                }
                return req.apply(undef, args.concat([relName, forceSync]));
            };
        }

        function makeNormalize(relName) {
            return function (name) {
                return normalize(name, relName);
            };
        }

        function makeLoad(depName) {
            return function (value) {
                defined[depName] = value;
            };
        }

        function callDep(name) {
            if (hasProp(waiting, name)) {
                var args = waiting[name];
                delete waiting[name];
                defining[name] = true;
                main.apply(undef, args);
            }

            if (!hasProp(defined, name) && !hasProp(defining, name)) {
                throw new Error('No ' + name);
            }
            return defined[name];
        }

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }

        //Creates a parts array for a relName where first part is plugin ID,
        //second part is resource ID. Assumes relName has already been normalized.
        function makeRelParts(relName) {
            return relName ? splitPrefix(relName) : [];
        }

        /**
         * Makes a name map, normalizing the name, and using a plugin
         * for normalization if necessary. Grabs a ref to plugin
         * too, as an optimization.
         */
        makeMap = function (name, relParts) {
            var plugin,
                parts = splitPrefix(name),
                prefix = parts[0],
                relResourceName = relParts[1];

            name = parts[1];

            if (prefix) {
                prefix = normalize(prefix, relResourceName);
                plugin = callDep(prefix);
            }

            //Normalize according
            if (prefix) {
                if (plugin && plugin.normalize) {
                    name = plugin.normalize(name, makeNormalize(relResourceName));
                } else {
                    name = normalize(name, relResourceName);
                }
            } else {
                name = normalize(name, relResourceName);
                parts = splitPrefix(name);
                prefix = parts[0];
                name = parts[1];
                if (prefix) {
                    plugin = callDep(prefix);
                }
            }

            //Using ridiculous property names for space reasons
            return {
                f: prefix ? prefix + '!' + name : name, //fullName
                n: name,
                pr: prefix,
                p: plugin
            };
        };

        function makeConfig(name) {
            return function () {
                return (config && config.config && config.config[name]) || {};
            };
        }

        handlers = {
            require: function (name) {
                return makeRequire(name);
            },
            exports: function (name) {
                var e = defined[name];
                if (typeof e !== 'undefined') {
                    return e;
                } else {
                    return (defined[name] = {});
                }
            },
            module: function (name) {
                return {
                    id: name,
                    uri: '',
                    exports: defined[name],
                    config: makeConfig(name)
                };
            }
        };

        main = function (name, deps, callback, relName) {
            var cjsModule, depName, ret, map, i, relParts,
                args = [],
                callbackType = typeof callback,
                usingExports;

            //Use name if no relName
            relName = relName || name;
            relParts = makeRelParts(relName);

            //Call the callback to define the module, if necessary.
            if (callbackType === 'undefined' || callbackType === 'function') {
                //Pull out the defined dependencies and pass the ordered
                //values to the callback.
                //Default to [require, exports, module] if no deps
                deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
                for (i = 0; i < deps.length; i += 1) {
                    map = makeMap(deps[i], relParts);
                    depName = map.f;

                    //Fast path CommonJS standard dependencies.
                    if (depName === "require") {
                        args[i] = handlers.require(name);
                    } else if (depName === "exports") {
                        //CommonJS module spec 1.1
                        args[i] = handlers.exports(name);
                        usingExports = true;
                    } else if (depName === "module") {
                        //CommonJS module spec 1.1
                        cjsModule = args[i] = handlers.module(name);
                    } else if (hasProp(defined, depName) ||
                               hasProp(waiting, depName) ||
                               hasProp(defining, depName)) {
                        args[i] = callDep(depName);
                    } else if (map.p) {
                        map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                        args[i] = defined[depName];
                    } else {
                        throw new Error(name + ' missing ' + depName);
                    }
                }

                ret = callback ? callback.apply(defined[name], args) : undefined;

                if (name) {
                    //If setting exports via "module" is in play,
                    //favor that over return value and exports. After that,
                    //favor a non-undefined return value over exports use.
                    if (cjsModule && cjsModule.exports !== undef &&
                            cjsModule.exports !== defined[name]) {
                        defined[name] = cjsModule.exports;
                    } else if (ret !== undef || !usingExports) {
                        //Use the return value from the function.
                        defined[name] = ret;
                    }
                }
            } else if (name) {
                //May just be an object definition for the module. Only
                //worry about defining if have a module name.
                defined[name] = callback;
            }
        };

        requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
            if (typeof deps === "string") {
                if (handlers[deps]) {
                    //callback in this case is really relName
                    return handlers[deps](callback);
                }
                //Just return the module wanted. In this scenario, the
                //deps arg is the module name, and second arg (if passed)
                //is just the relName.
                //Normalize module name, if it contains . or ..
                return callDep(makeMap(deps, makeRelParts(callback)).f);
            } else if (!deps.splice) {
                //deps is a config object, not an array.
                config = deps;
                if (config.deps) {
                    req(config.deps, config.callback);
                }
                if (!callback) {
                    return;
                }

                if (callback.splice) {
                    //callback is an array, which means it is a dependency list.
                    //Adjust args if there are dependencies
                    deps = callback;
                    callback = relName;
                    relName = null;
                } else {
                    deps = undef;
                }
            }

            //Support require(['a'])
            callback = callback || function () { };

            //If relName is a function, it is an errback handler,
            //so remove it.
            if (typeof relName === 'function') {
                relName = forceSync;
                forceSync = alt;
            }

            //Simulate async callback;
            if (forceSync) {
                main(undef, deps, callback, relName);
            } else {
                //Using a non-zero value because of concern for what old browsers
                //do, and latest browsers "upgrade" to 4 if lower value is used:
                //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
                //If want a value immediately, use require('id') instead -- something
                //that works in almond on the global level, but not guaranteed and
                //unlikely to work in other AMD implementations.
                setTimeout(function () {
                    main(undef, deps, callback, relName);
                }, 4);
            }

            return req;
        };

        /**
         * Just drops the config on the floor, but returns req in case
         * the config return value is used.
         */
        req.config = function (cfg) {
            return req(cfg);
        };

        /**
         * Expose module registry for debugging and tooling
         */
        requirejs._defined = defined;

        define = function (name, deps, callback) {
            if (typeof name !== 'string') {
                throw new Error('See almond README: incorrect module build, no module name');
            }

            //This module may not have dependencies
            if (!deps.splice) {
                //deps is not an array, so probably means
                //an object literal or factory function for
                //the value. Adjust args.
                callback = deps;
                deps = [];
            }

            if (!hasProp(defined, name) && !hasProp(waiting, name)) {
                waiting[name] = [name, deps, callback];
            }
        };

        define.amd = {
            jQuery: true
        };
    }());

    //define(function () {

    /**
    *@class
    *@memberof MeteoLib.Util
    */
    function Path() { }
    /**
    *
    *获取文件扩展名（后缀）
    *@param {String}fname 文件名
    */
    Path.GetExtension = function (fname) {
        var start = fname.lastIndexOf(".");
        return fname.substring(start, fname.length);
    };

    /**
    *
    *获取文件扩展名（后缀）
    *@param {String}fname 文件名
    */
    Path.GetFileName = function (fname) {
        var start = fname.lastIndexOf("/");
        if (start < 0) {
            return fname;
        }
        return fname.substring(start + 1, fname.length);
    };
    /**
    *
    *获取文件夹
    *@param {String}fname 文件名
    */
    Path.GetDirectoryName = function (fname) {
        var start = fname.lastIndexOf("/");
        if (start < 0) {
            return "";
        }
        return fname.substring(0, start);
    };
    /**
    *
    *获取文件夹
    *@param {String}fname 文件名
    */
    Path.Combine = function (dir, fname) {
        return dir + fname;
    };
    Path.ChangeExtension = function (fname, newExt) {
        return fname.replace(Path.GetExtension(fname), newExt);
    };
    //    return Path;
    //});

    if (typeof module === "undefined") {
        this.Path = Path;
    } else {
        module.exports = Path;
    }
    if (typeof define === "function") {
        define('Util/Path', [], function () { return Path; });
    }
    (function () {
        var M = Math,
        pow = M.pow,
        ArraySlice = Array.prototype.slice,
        root = window,
        c2c = String.fromCharCode,
        non_enc = /[^0-9a-z]/g,
        pass = function (a) { return a; },
        encodings = {
            ascii: [pass, pass],
            binary: [pass, pass],
            utf8: [u8e, u8d],
            ucs2: [u2e, u2d],
            hex: [hxe, hxd],
            base64: [atob, btoa]
        },
        non_hex = /[^0-9A-Fa-f]/g;

        function mix(dst, src) {
            for (var i in src) {
                dst[i] = src[i];
            }
            i = 'toString';
            if (dst[i] !== src[i]) { /* Fuck IE */
                dst[i] = src[i];
            }
            return dst;
        }

        /* string to utf8 encode */
        function u8e(str) {
            return unescape(encodeURIComponent(str));
        }

        /* utf8 to string decode */
        function u8d(str) {
            return decodeURIComponent(escape(str));
        }

        /* string to ucs2 encode */
        function u2e(str) {
            var ret = '',
            i = 0,
            val;
            for (; i < str.length;) {
                val = str.charCodeAt(i++);
                ret += c2c(val % 256) + c2c(val >>> 8);
            }
            return ret;
        }

        /* ucs2 to string decode */
        function u2d(str) {
            var ret = '',
            i = 0;
            for (; i < str.length;) {
                ret += c2c(str.charCodeAt(i++) + (str.charCodeAt(i++) << 8));
            }
            return ret;
        }

        /* hex to binary encode */
        function hxe(str) {
            var ret = '',
            i = 0;
            for (; i < str.length; i++) {
                ret += c2c(parseInt(str.substr(i++, 2), 16));
            }
            return ret;
        }

        /* binary to hex decode */
        function hxd(str) {
            var ret = '',
            i = 0,
            c;
            for (; i < str.length;) {
                c = (str.charCodeAt(i++) & 0xff).toString(16);
                for (; c.length < 2; c = '0' + c);
                ret += c;
            }
            return ret;
        }

        /* Generalized Constructor */
        function Buffer(data, encoding) {
            if (!(this instanceof Buffer)) {
                return new Buffer(data, encoding);
            }
            var len = buffer_len(data, encoding),
            buf = wrap(this, 0, len);
            buffer_write(buf, data, encoding);
            return buf;
        }

        /* Feature Detecting/Configuring */
        mix(Buffer, {
            useArrayBuffer: root.ArrayBuffer && {}.__proto__,
            useTypedArrays: !!root.Int8Array,
            useDataView: !!root.DataView
        });

        if (typeof root.Buffer == 'object') {
            mix(Buffer, root.Buffer);
        }
        root.Buffer = Buffer;

        /* Assertion Helper */
        function ast(val, msg) {
            if (!val) {
                throw new Error(msg);
            }
        }

        /* Encoding Assertion Helper */
        function enc_ast(encoding) {
            encoding = (encoding || 'utf8').toLowerCase().replace(non_enc, '');
            ast(encoding in encodings, 'Unknown encoding');
            return encoding;
        }

        /* Hex String Assertion Helper */
        function hex_ast(val) {
            ast(!(val.length % 2) && val.search(non_hex) < 0, 'Invalid hex string');
        }

        /* Initial Buffer Length Helper */
        function buffer_len(data, encoding) {
            encoding = enc_ast(encoding);
            if (typeof data == 'number') {
                return data > 0 ? data : 0;
            } else if (typeof data == 'string') {
                return Buffer.byteLength(data, encoding);
            } else if (data instanceof Array) {
                return data.length;
            }
            return 0;
        }

        function buffer_write(self, data, encoding) {
            if (typeof data == 'string') {
                self.write(data, 0, self.length, encoding);
            } else if (data instanceof Array) {
                for (var i = 0; i < data.length; i++) {
                    //self['write' + (data[i] < 0 ? '' : 'U') + 'Int8'](data[i], i);
                    self.writeUInt8(data[i], i, true);
                }
            }
        }

        function notnil(value) {
            return value !== undefined && value !== null;
        }

        /* Get Assertion Helper */
        function get_ast(self, offset, noAssert, bytes) {
            if (!noAssert) {
                ast(notnil(offset), 'missing offset');
                ast(offset >= 0, 'trying to read at negative offset');
                ast(offset + bytes <= self.length, 'Trying to read beyond buffer length');
            }
        }

        /* Set Assertion Helper */
        function set_ast(self, value, offset, noAssert, bytes, max, min, fract) {
            if (!noAssert) {
                min = min || 0x0;
                ast(notnil(offset), 'missing offset');
                ast(notnil(value), 'missing value');
                ast(offset >= 0, 'trying to write at negative offset');
                ast(offset + bytes <= self.length, 'trying to write beyond buffer length');
                /* value */
                ast(typeof value == 'number', 'cannot write a non-number as a number');
                ast(value >= min, min == 0 ? 'specified a negative value for writing an unsigned value'
                    : 'value smaller than minimum allowed value');
                ast(value <= max, 'value is larger than maximum' + min == 0 ? 'value for type' : 'allowed value');
                ast(fract || M.floor(value) === value, 'value has a fractional component');
            }
        }

        /* Cooking Assertion with specified arguments */
        function cook_ast(bytes, max, min, fract) {
            return max ? function (self, value, offset, noAssert) { /* write_ast */
                set_ast(self, value, offset, noAssert, bytes, max, min, fract);
            } : function (self, offset, noAssert) { /* read_ast */
                get_ast(self, offset, noAssert, bytes);
            };
        }

        var /* Read Asserts */
        read8_ast = cook_ast(1),
        read16_ast = cook_ast(2),
        read32_ast = cook_ast(4),
        read64_ast = cook_ast(8),
        /* Write Asserts */
        write8u_ast = cook_ast(1, 0xff),
        write16u_ast = cook_ast(2, 0xffff),
        write32u_ast = cook_ast(4, 0xffffffff),
        write8s_ast = cook_ast(1, 0x7f, -0x80),
        write16s_ast = cook_ast(2, 0x7fff, -0x8000),
        write32s_ast = cook_ast(4, 0x7fffffff, -0x80000000),
        write32_ast = cook_ast(4, 3.4028234663852886e+38, -3.4028234663852886e+38, true),
        write64_ast = cook_ast(8, 1.7976931348623157E+308, -1.7976931348623157E+308, true);

        if (Buffer.useArrayBuffer &&
           (Buffer.useDataView || Buffer.useTypedArrays)) {

            var ArrayBuf = ArrayBuffer,
            DataProxy,
            wrap = function (self, start, length) {
                if (!length) {
                    return self;
                }

                var buffer = self.buffer || new ArrayBuf(length); // (sic!) potentially this may have problem
                if (self.offset) {
                    start += self.offset;
                }
                // Wrong but ideologically more correct:
                // DataView.call(this, buf)

                var proxy = new DataProxy(buffer, start, length);
                proxy.__proto__ = Buffer.prototype;
                // Firefox disallow to set __proto__ field of Typed Arrays
                if (proxy.__proto__ === Buffer.prototype) {
                    self = proxy;
                } else {
                    self = Buffer();
                }

                self.buffer = buffer;
                self.offset = start;
                self.length = length;
                return self;
            };

            if (Buffer.useDataView) {
                Buffer.backend = 'DataView';
                DataProxy = DataView;

                var cook_val = function (type, write) {
                    return DataProxy.prototype[(write ? 'set' : 'get') + type];
                };
            } else {
                Buffer.backend = 'TypedArrays';
                DataProxy = Uint8Array;

                var nativeLE = function () { /* check is native Little Endian */
                    var buffer = new ArrayBuf();
                    new Uint16Array(buffer)[0] = 1;
                    return !new DataProxy(buffer)[0];
                }(),
                fix_order = function (buffer, offset, count, isLE, cons, value) {
                    var write = arguments.length > 5,
                    typed;
                    if (count < 2 || nativeLE == isLE) {
                        typed = new cons(buffer, offset, 1);
                        if (write) {
                            typed[0] = value;
                        } else {
                            return typed[0];
                        }
                    } else {
                        var reversed = new ArrayBuf(count),
                        bytes = new DataProxy(buffer, offset, count),
                        rbytes = new DataProxy(reversed),
                        up = count - 1,
                        i = 0;
                        typed = new cons(reversed);
                        if (write) {
                            typed[0] = value;
                            for (; i < count; bytes[up - i] = rbytes[i++]);
                        } else {
                            for (; i < count; rbytes[up - i] = bytes[i++]);
                            return typed[0];
                        }
                    }
                },
                cook_val = function (type, write) {
                    var cons = root[type + 'Array'],
                    count = parseInt(type.replace(/^\D+/, ''), 10) >>> 3;
                    return write ? function (offset, value, isLE) {
                        fix_order(this.buffer, offset + this.offset, count, isLE, cons, value);
                    } : function (offset, isLE) {
                        return fix_order(this.buffer, offset + this.offset, count, isLE, cons);
                    };
                };
            }

            var
            readUInt8 = cook_val('Uint8'),
            readUInt16 = cook_val('Uint16'),
            readUInt32 = cook_val('Uint32'),

            readInt8 = cook_val('Int8'),
            readInt16 = cook_val('Int16'),
            readInt32 = cook_val('Int32'),

            readFloat = cook_val('Float32'),
            readDouble = cook_val('Float64'),

            writeUInt8 = cook_val('Uint8', 1),
            writeUInt16 = cook_val('Uint16', 1),
            writeUInt32 = cook_val('Uint32', 1),

            writeInt8 = cook_val('Int8', 1),
            writeInt16 = cook_val('Int16', 1),
            writeInt32 = cook_val('Int32', 1),

            writeFloat = cook_val('Float32', 1),
            writeDouble = cook_val('Float64', 1);

            // Already not necessary in this
            /* BufferProxy = function(){};
             BufferProxy.prototype = DataProxy.prototype;
             Buffer.prototype = new BufferProxy(); */

        } else {
            Buffer.backend = 'Array';

            /**
             * Function readIEEE754 and writeIEEE754 forked from
             * ysangkok's buffer-browserify
             *
             * git://github.com/toots/buffer-browserify.git
             */

            function readIEEE754(buffer, offset, isLE, mLen, nBytes) {
                var e, m,
                eLen = nBytes * 8 - mLen - 1,
                eMax = (1 << eLen) - 1,
                eBias = eMax >> 1,
                nBits = -7,
                i = isLE ? (nBytes - 1) : 0,
                d = isLE ? -1 : 1,
                s = buffer[offset + i];

                i += d;

                e = s & ((1 << (-nBits)) - 1);
                s >>= (-nBits);
                nBits += eLen;
                for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

                m = e & ((1 << (-nBits)) - 1);
                e >>= (-nBits);
                nBits += mLen;
                for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

                if (e === 0) {
                    e = 1 - eBias;
                } else if (e === eMax) {
                    return m ? NaN : ((s ? -1 : 1) * Infinity);
                } else {
                    m = m + pow(2, mLen);
                    e = e - eBias;
                }
                return (s ? -1 : 1) * m * pow(2, e - mLen);
            }

            function writeIEEE754(buffer, offset, value, isLE, mLen, nBytes) {
                var e, m, c,
                eLen = nBytes * 8 - mLen - 1,
                eMax = (1 << eLen) - 1,
                eBias = eMax >> 1,
                rt = (mLen === 23 ? pow(2, -24) - pow(2, -77) : 0),
                i = isLE ? 0 : (nBytes - 1),
                d = isLE ? 1 : -1,
                s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

                value = M.abs(value);

                if (isNaN(value) || value === Infinity) {
                    m = isNaN(value) ? 1 : 0;
                    e = eMax;
                } else {
                    e = M.floor(M.log(value) / M.LN2);
                    if (value * (c = pow(2, -e)) < 1) {
                        e--;
                        c *= 2;
                    }
                    if (e + eBias >= 1) {
                        value += rt / c;
                    } else {
                        value += rt * pow(2, 1 - eBias);
                    }
                    if (value * c >= 2) {
                        e++;
                        c /= 2;
                    }

                    if (e + eBias >= eMax) {
                        m = 0;
                        e = eMax;
                    } else if (e + eBias >= 1) {
                        m = (value * c - 1) * pow(2, mLen);
                        e = e + eBias;
                    } else {
                        m = value * pow(2, eBias - 1) * pow(2, mLen);
                        e = 0;
                    }
                }

                for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

                e = (e << mLen) | m;
                eLen += mLen;
                for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

                buffer[offset + i - d] |= s * 128;
            }

            var wrap = function (self, start, length) {
                var buffer = self.buffer || length > 0 && new Array(length),
                i = 0;
                if (self.offset) {
                    start += self.offset;
                }
                if (!self.buffer) { /* init */
                    if (buffer) {
                        /* touch */
                        for (; i < length; buffer[start + i++] = 0);
                    }
                } else {
                    self = Buffer();
                }
                self.buffer = buffer;
                self.offset = start;
                self.length = length;
                return self;
            },

            /* readOps */
            readUInt8 = function (offset) {
                return this.buffer[this.offset + offset];
            },
            readUInt16 = function (offset, isLE) {
                return readUInt8.call(this, offset + (isLE ? 1 : 0)) << 8
                  | readUInt8.call(this, offset + (isLE ? 0 : 1));
            },
            readUInt32 = function (offset, isLE) {
                //return (readUInt16.call(this, offset + (isLE ? 2 : 0), isLE) << 16) | // it's wrong!
                return (readUInt16.call(this, offset + (isLE ? 2 : 0), isLE) << 15) * 2 // we use this instead
                  + readUInt16.call(this, offset + (isLE ? 0 : 2), isLE);
            },

            readInt8 = function (offset) {
                offset = readUInt8.call(this, offset);
                return offset & 0x80 ? offset - 0x100 : offset;
            },
            readInt16 = function (offset, isLE) {
                offset = readUInt16.call(this, offset, isLE);
                return offset & 0x8000 ? offset - 0x10000 : offset;
            },
            readInt32 = function (offset, isLE) {
                offset = readUInt32.call(this, offset, isLE);
                return offset & 0x80000000 ? offset - 0x100000000 : offset;
            },

            readFloat = function (offset, isLE) {
                return readIEEE754(this.buffer, this.offset + offset, isLE, 23, 4);
            },
            readDouble = function (offset, isLE) {
                return readIEEE754(this.buffer, this.offset + offset, isLE, 52, 8);
            },

            /* writeOps */
            writeUInt8 = function (offset, value) {
                this.buffer[this.offset + offset] = value;// & 0xff;
            },
            writeUInt16 = function (offset, value, isLE) {
                //value &= 0xffff;
                writeUInt8.call(this, offset + (isLE ? 1 : 0), value >>> 8);
                writeUInt8.call(this, offset + (isLE ? 0 : 1), value & 0xff);
            },
            writeUInt32 = function (offset, value, isLE) {
                //value &= 0xffffffff;
                writeUInt16.call(this, offset + (isLE ? 2 : 0), value >>> 16, isLE);
                writeUInt16.call(this, offset + (isLE ? 0 : 2), value & 0xffff, isLE);
            },

            writeInt8 = function (offset, value) {
                writeUInt8.call(this, offset, value < 0 ? value + 0x100 : value);
            },
            writeInt16 = function (offset, value, isLE) {
                writeUInt16.call(this, offset, value < 0 ? value + 0x10000 : value, isLE);
            },
            writeInt32 = function (offset, value, isLE) {
                writeUInt32.call(this, offset, value < 0 ? value + 0x100000000 : value, isLE);
            },

            writeFloat = function (offset, value, isLE) {
                return writeIEEE754(this.buffer, this.offset + offset, value, isLE, 23, 4);
            },
            writeDouble = function (offset, value, isLE) {
                return writeIEEE754(this.buffer, this.offset + offset, value, isLE, 52, 8);
            };
        }

        mix(Buffer, {
            isBuffer: function (obj) {
                return obj instanceof Buffer;
            },
            byteLength: function (string, encoding) {
                encoding = enc_ast(encoding);
                ast(typeof string == 'string', 'Argument must be a string');
                switch (encoding) {
                    case 'ascii':
                    case 'binary':
                        return string.length;
                    case 'hex':
                        //hex_ast(string); /* NodeJS don't checks it here, so we also keep this feature */
                        return string.length >>> 1;
                        //return M.ceil(string.length / 2);
                    case 'base64':
                        var e = string.search(/=/);
                        return (string.length * 3 >>> 2) - (e < 0 ? 0 : (string.length - e));
                    case 'ucs2':
                        return string.length * 2;
                    case 'utf8':
                    default:
                        return u8e(string).length;
                        // function u8l(string){
                        /*var t,
                        c = 0,
                        i = 0;
                        for(; i < string.length; ){
                          t = string.charCodeAt(i++);
                          for(c++; t >>>= 8; c++);
                        }
                        return c;*/
                        // }
                }
            },
            concat: function (list/*, totalLength*/) {
                var args = ArraySlice.call(arguments),
                totalLength = typeof args[args.length - 1] == 'number' ? args.pop() : -1,
                length = 0,
                i = 0,
                bufs = [],
                buf,
                ret,
                skip = 0;

                if (!(list instanceof Array)) {
                    list = args;
                }

                for (; i < list.length;) {
                    buf = list[i++];
                    if (buf) {
                        if (!Buffer.isBuffer(buf)) {
                            buf = new Buffer(buf);
                        }
                        length += buf.length;
                        bufs.push(buf);
                    }
                }

                ret = new Buffer(length = totalLength < 0 ? length : totalLength);
                for (; bufs.length && skip < length;) {
                    buf = bufs.shift();
                    buf.copy(ret, skip, 0, M.min(buf.length, length - skip));
                    skip += buf.length;
                }

                return ret;
            }
        });

        mix(Buffer.prototype, {
            /* Buffer value access */
            /* readUInts */
            readUInt8: function (offset, noAssert) {
                read8_ast(this, offset, noAssert);
                return readUInt8.call(this, offset);
            },
            readUInt16LE: function (offset, noAssert) {
                read16_ast(this, offset, noAssert);
                return readUInt16.call(this, offset, true);
            },
            readUInt16BE: function (offset, noAssert) {
                read16_ast(this, offset, noAssert);
                return readUInt16.call(this, offset, false);
            },
            readUInt32LE: function (offset, noAssert) {
                read32_ast(this, offset, noAssert);
                return readUInt32.call(this, offset, true);
            },
            readUInt32BE: function (offset, noAssert) {
                read32_ast(this, offset, noAssert);
                return readUInt32.call(this, offset, false);
            },
            /* readInts */
            readInt8: function (offset, noAssert) {
                read8_ast(this, offset, noAssert);
                return readInt8.call(this, offset);
            },
            readInt16LE: function (offset, noAssert) {
                read16_ast(this, offset, noAssert);
                return readInt16.call(this, offset, true);
            },
            readInt16BE: function (offset, noAssert) {
                read16_ast(this, offset, noAssert);
                return readInt16.call(this, offset, false);
            },
            readInt32LE: function (offset, noAssert) {
                read32_ast(this, offset, noAssert);
                return readInt32.call(this, offset, true);
            },
            readInt32BE: function (offset, noAssert) {
                read32_ast(this, offset, noAssert);
                return readInt32.call(this, offset, false);
            },
            /* readFloats */
            readFloatLE: function (offset, noAssert) {
                read32_ast(this, offset, noAssert);
                return readFloat.call(this, offset, true);
            },
            readFloatBE: function (offset, noAssert) {
                read32_ast(this, offset, noAssert);
                return readFloat.call(this, offset, false);
            },
            readDoubleLE: function (offset, noAssert) {
                read64_ast(this, offset, noAssert);
                return readDouble.call(this, offset, true);
            },
            readDoubleBE: function (offset, noAssert) {
                read64_ast(this, offset, noAssert);
                return readDouble.call(this, offset, false);
            },
            /* writeUInts */
            writeUInt8: function (value, offset, noAssert) {
                write8u_ast(this, value, offset, noAssert);
                return writeUInt8.call(this, offset, value);
            },
            writeUInt16LE: function (value, offset, noAssert) {
                write16u_ast(this, value, offset, noAssert);
                return writeUInt16.call(this, offset, value, true);
            },
            writeUInt16BE: function (value, offset, noAssert) {
                write16u_ast(this, value, offset, noAssert);
                return writeUInt16.call(this, offset, value, false);
            },
            writeUInt32LE: function (value, offset, noAssert) {
                write32u_ast(this, value, offset, noAssert);
                return writeUInt32.call(this, offset, value, true);
            },
            writeUInt32BE: function (value, offset, noAssert) {
                write32u_ast(this, value, offset, noAssert);
                return writeUInt32.call(this, offset, value, false);
            },
            /* writeInts */
            writeInt8: function (value, offset, noAssert) {
                write8s_ast(this, value, offset, noAssert);
                return writeInt8.call(this, offset, value);
            },
            writeInt16LE: function (value, offset, noAssert) {
                write16s_ast(this, value, offset, noAssert);
                return writeInt16.call(this, offset, value, true);
            },
            writeInt16BE: function (value, offset, noAssert) {
                write16s_ast(this, value, offset, noAssert);
                return writeInt16.call(this, offset, value, false);
            },
            writeInt32LE: function (value, offset, noAssert) {
                write32s_ast(this, value, offset, noAssert);
                return writeInt32.call(this, offset, value, true);
            },
            writeInt32BE: function (value, offset, noAssert) {
                write32s_ast(this, value, offset, noAssert);
                return writeInt32.call(this, offset, value, false);
            },
            /* writeFloats */
            writeFloatLE: function (value, offset, noAssert) {
                write32_ast(this, value, offset, noAssert);
                return writeFloat.call(this, offset, value, true);
            },
            writeFloatBE: function (value, offset, noAssert) {
                write32_ast(this, value, offset, noAssert);
                return writeFloat.call(this, offset, value, false);
            },
            writeDoubleLE: function (value, offset, noAssert) {
                write64_ast(this, value, offset, noAssert);
                return writeDouble.call(this, offset, value, true);
            },
            writeDoubleBE: function (value, offset, noAssert) {
                write64_ast(this, value, offset, noAssert);
                return writeDouble.call(this, offset, value, false);
            },
            /* Buffer operations */
            slice: function (start, end) {
                var self = this;
                start = start || 0;
                end = end || self.length;
                /* Slice Assertion Helper */
                ast(start >= 0 && start < end && end <= self.length, 'oob');
                return wrap(self, start, end - start);
            },
            write: function (string, offset, length, encoding) {
                var self = this,
                i = 0;
                offset = offset || 0;
                length = length || self.length - offset;
                /* Assertion */
                ast(typeof string == 'string', 'Argument must be a string');
                encoding = enc_ast(encoding);
                /* Decode source string with specified encoding to binary string */
                string = encodings[encoding][0].call(root, string);
                /* Write binary string to buffer */
                for (; i < length; self.writeUInt8(string.charCodeAt(i) & 0xff, offset + i++));
                return length;
            },
            copy: function (target, offset, start, end) {
                offset = offset || 0;
                start = start || 0;
                var self = this,
                i = start;
                end = end || self.length;
                /* Assertion */
                ast(end >= start, 'sourceEnd < sourceStart');
                ast(offset >= 0 && offset < target.length, 'targetStart out of bounds');
                ast(start >= 0 && start < self.length, 'sourceStart out of bounds');
                ast(end >= 0 && end <= self.length, 'sourceEnd out of bounds');
                /* Copy */
                for (; i < end; target.writeUInt8(self.readUInt8(i), offset + i++ - start));
            },
            fill: function (value, offset, end) {
                offset = offset || 0;
                var self = this,
                i = offset;
                end = end || self.length;
                if (typeof value == 'string') {
                    value = value.charCodeAt(0); // (sic!) no ucs2 check
                }
                /* Assertion */
                ast(typeof value === 'number' && !isNaN(value), 'value is not a number');
                ast(end >= offset, 'end < start');
                ast(offset >= 0 && offset < self.length, 'start out of bounds');
                ast(end > 0 && end <= self.length, 'end out of bounds');
                /* Fill */
                value &= 0xff;
                for (; i < end; self.writeUInt8(value, i++));
            },
            INSPECT_MAX_BYTES: 50,
            inspect: function (length) {
                var self = this,
                i = 0,
                bytes = '',
                h;
                length = M.min(self.INSPECT_MAX_BYTES, self.length, length || self.length);
                for (; i < length;) {
                    h = self.readUInt8(i++).toString(16);
                    bytes += ' ' + (h.length < 2 ? '0' : '') + h;
                }
                return '<Buffer' + bytes + (i < self.length ? ' ... ' : '') + '>';
            },
            toString: function (encoding, start, end) {
                var self = this,
                i = start || 0,
                string = '';
                if (arguments.length < 1) {
                    return self.inspect();
                }
                start = i;
                end = end || self.length;
                /* Accertion */
                encoding = enc_ast(encoding);
                /* Produce binary string from buffer data */
                for (; i < end; string += c2c(self.readUInt8(i++)));
                /* Decode binary string to specified encoding */
                return encodings[encoding][1].call(root, string);
            }
        });
    })();

    define("ThirdParty/Buffer.JS-0.2.1/buffer", function () { });

    /// <reference path="../../ThirdParty/Buffer.JS-0.2.1/buffer.js" />
    /// <reference path="../../Util/Path.js" />
    define('Scene/Model/ObjLoader/createGltf', [
        "Util/Path",
        "ThirdParty/Buffer.JS-0.2.1/buffer"
    ], function (
        Path,
        bufferjs
        ) {
        "use strict";

        var defined = Cesium.defined;
        var defaultValue = Cesium.defaultValue;
        var WebGLConstants = Cesium.WebGLConstants;

        /**
        *
        *@param {Object} data
        *@param {String} inputPath
        *@param {String} modelName
        *@private
        */
        function createGltf(data, inputPath, modelName) {
            var vertexCount = data.vertexCount;
            var vertexArray = data.vertexArray;
            var positionMin = data.positionMin;
            var positionMax = data.positionMax;
            var hasUVs = data.hasUVs;
            var hasNormals = data.hasNormals;
            var materialGroups = data.materialGroups;
            var materials = data.materials;
            var images = data.images;

            var i, j, name;

            var sizeOfFloat32 = 4;
            var sizeOfUint32 = 4;
            var sizeOfUint16 = 2;

            var indexComponentType;
            var indexComponentSize;

            // Reserve the 65535 index for primitive restart
            if (vertexCount < 65535) {
                indexComponentType = WebGLConstants.UNSIGNED_SHORT;
                indexComponentSize = sizeOfUint16;
            } else {
                indexComponentType = WebGLConstants.UNSIGNED_INT;
                indexComponentSize = sizeOfUint32;
            }

            // Create primitives
            var primitives = [];
            var indexArrayLength = 0;
            var indexArray;
            var indexCount;
            for (name in materialGroups) {
                if (materialGroups.hasOwnProperty(name)) {
                    indexArray = materialGroups[name];
                    indexCount = indexArray.length;
                    primitives.push({
                        indexArray: indexArray,
                        indexOffset: indexArrayLength,
                        indexCount: indexCount,
                        material: name
                    });
                    indexArrayLength += indexCount;
                }
            }

            // Create buffer to store vertex and index data
            var indexArrayByteLength = indexArrayLength * indexComponentSize;
            var vertexArrayLength = vertexArray.length; // In floats
            var vertexArrayByteLength = vertexArrayLength * sizeOfFloat32;
            var bufferByteLength = vertexArrayByteLength + indexArrayByteLength;
            var buffer = new Buffer(bufferByteLength);

            // Write vertex data
            var byteOffset = 0;
            for (i = 0; i < vertexArrayLength; ++i) {
                buffer.writeFloatLE(vertexArray[i], byteOffset);
                byteOffset += sizeOfFloat32;
            }

            // Write index data
            var primitivesLength = primitives.length;
            for (i = 0; i < primitivesLength; ++i) {
                indexArray = primitives[i].indexArray;
                indexCount = indexArray.length;
                for (j = 0; j < indexCount; ++j) {
                    if (indexComponentSize === sizeOfUint16) {
                        buffer.writeUInt16LE(indexArray[j], byteOffset);
                    } else {
                        buffer.writeUInt32LE(indexArray[j], byteOffset);
                    }
                    byteOffset += indexComponentSize;
                }
            }

            var positionByteOffset = 0;
            var normalByteOffset = 0;
            var uvByteOffset = 0;
            var vertexByteStride = 0;

            if (hasNormals && hasUVs) {
                normalByteOffset = sizeOfFloat32 * 3;
                uvByteOffset = sizeOfFloat32 * 6;
                vertexByteStride = sizeOfFloat32 * 8;
            } else if (hasNormals && !hasUVs) {
                normalByteOffset = sizeOfFloat32 * 3;
                vertexByteStride = sizeOfFloat32 * 6;
            } else if (!hasNormals && hasUVs) {
                uvByteOffset = sizeOfFloat32 * 3;
                vertexByteStride = sizeOfFloat32 * 5;
            } else if (!hasNormals && !hasUVs) {
                vertexByteStride = sizeOfFloat32 * 3;
            }

            var bufferId = modelName + '_buffer';
            var bufferViewVertexId = 'bufferView_vertex';
            var bufferViewIndexId = 'bufferView_index';
            var accessorPositionId = 'accessor_position';
            var accessorUVId = 'accessor_uv';
            var accessorNormalId = 'accessor_normal';
            var meshId = 'mesh_' + modelName;
            var sceneId = 'scene_' + modelName;
            var nodeId = 'node_' + modelName;
            var samplerId = 'sampler_0';

            function getAccessorIndexId(i) {
                return 'accessor_index_' + i;
            }

            function getMaterialId(material) {
                return 'material_' + material;
            }

            function getTextureId(image) {
                if (!defined(image)) {
                    return undefined;
                }
                return 'texture_' + Path.GetFileName(image);//.substr(0, image.lastIndexOf('.'));
            }

            function getImageId(image) {
                return Path.GetFileName(image);//.substr(0, image.lastIndexOf('.'));//Path.GetFileName(image).replace(Path.GetExtension(image));
            }

            var gltf = {
                accessors: {},
                asset: {},
                buffers: {},
                bufferViews: {},
                images: {},
                materials: {},
                meshes: {},
                nodes: {},
                samplers: {},
                scene: sceneId,
                scenes: {},
                textures: {}
            };

            gltf.asset = {
                "generator": "ObjLoader",
                "premultipliedAlpha": true,
                "profile": {
                    "api": "WebGL",
                    "version": "1.0"
                },
                "version": 1,
                "author_e":"695034525@qq.com",
                "author_n": "\u97e6\u4fee\u52c7"
            };

            gltf.scenes[sceneId] = {
                nodes: [nodeId]
            };

            gltf.nodes[nodeId] = {
                children: [],
                matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                meshes: [meshId],
                name: modelName
            };

            gltf.samplers[samplerId] = {}; // Use default values

            var bufferSeparate = false;
            var bufferUri;
            if (buffer.length > 201326580) {
                // toString fails for buffers larger than ~192MB. Instead save the buffer to a .bin file.
                // Source: https://github.com/nodejs/node/issues/4266
                bufferSeparate = true;
                bufferUri = modelName + '.bin';
            } else {
                bufferUri = 'data:application/octet-stream;base64,' + buffer.toString('base64');
            }

            gltf.buffers[bufferId] = {
                byteLength: bufferByteLength,
                type: 'arraybuffer',
                uri: bufferUri
            };

            gltf.bufferViews[bufferViewVertexId] = {
                buffer: bufferId,
                byteLength: vertexArrayByteLength,
                byteOffset: 0,
                target: WebGLConstants.ARRAY_BUFFER
            };
            gltf.bufferViews[bufferViewIndexId] = {
                buffer: bufferId,
                byteLength: indexArrayByteLength,
                byteOffset: vertexArrayByteLength,
                target: WebGLConstants.ELEMENT_ARRAY_BUFFER
            };

            for (i = 0; i < primitivesLength; ++i) {
                var primitive = primitives[i];
                gltf.accessors[getAccessorIndexId(i)] = {
                    bufferView: bufferViewIndexId,
                    byteOffset: primitive.indexOffset * indexComponentSize,
                    byteStride: 0,
                    componentType: indexComponentType,
                    count: primitive.indexCount,
                    type: 'SCALAR'
                };
            }

            gltf.accessors[accessorPositionId] = {
                bufferView: bufferViewVertexId,
                byteOffset: positionByteOffset,
                byteStride: vertexByteStride,
                componentType: WebGLConstants.FLOAT,
                count: vertexCount,
                min: positionMin,
                max: positionMax,
                type: 'VEC3'
            };

            if (hasNormals) {
                gltf.accessors[accessorNormalId] = {
                    bufferView: bufferViewVertexId,
                    byteOffset: normalByteOffset,
                    byteStride: vertexByteStride,
                    componentType: WebGLConstants.FLOAT,
                    count: vertexCount,
                    type: 'VEC3'
                };
            }

            if (hasUVs) {
                gltf.accessors[accessorUVId] = {
                    bufferView: bufferViewVertexId,
                    byteOffset: uvByteOffset,
                    byteStride: vertexByteStride,
                    componentType: WebGLConstants.FLOAT,
                    count: vertexCount,
                    type: 'VEC2'
                };
            }

            var gltfPrimitives = [];
            gltf.meshes[meshId] = {
                name: modelName,
                primitives: gltfPrimitives
            };

            var gltfAttributes = {};
            gltfAttributes.POSITION = accessorPositionId;
            if (hasNormals) {
                gltfAttributes.NORMAL = accessorNormalId;
            }
            if (hasUVs) {
                gltfAttributes.TEXCOORD_0 = accessorUVId;
            }

            for (i = 0; i < primitivesLength; ++i) {
                gltfPrimitives.push({
                    attributes: gltfAttributes,
                    indices: getAccessorIndexId(i),
                    material: getMaterialId(primitives[i].material),
                    mode: WebGLConstants.TRIANGLES
                });
            }

            for (name in materials) {
                if (materials.hasOwnProperty(name)) {
                    var material = materials[name];
                    var materialId = getMaterialId(name);
                    var values = {
                        ambient: defaultValue(defaultValue(getTextureId(material.ambientColorMap), material.ambientColor), [0, 0, 0, 1]),
                        diffuse: defaultValue(defaultValue(getTextureId(material.diffuseColorMap), material.diffuseColor), [0, 0, 0, 1]),
                        emission: defaultValue(defaultValue(getTextureId(material.emissionColorMap), material.emissionColor), [0, 0, 0, 1]),
                        specular: defaultValue(defaultValue(getTextureId(material.specularColorMap), material.specularColor), [0, 0, 0, 1]),
                        shininess: defaultValue(material.specularShininess, 0.0)
                    };

                    gltf.materials[materialId] = {
                        name: name,
                        values: values
                    };
                }
            }

            for (name in images) {
                if (images.hasOwnProperty(name)) {
                    var image = images[name];
                    var imageId = getImageId(name);
                    var textureId = getTextureId(name);
                    var format;
                    var channels = image.channels;
                    switch (channels) {
                        case 1:
                            format = WebGLConstants.ALPHA;
                            break;
                        case 2:
                            format = WebGLConstants.LUMINANCE_ALPHA;
                            break;
                        case 3:
                            format = WebGLConstants.RGB;
                            break;
                        case 4:
                            format = WebGLConstants.RGBA;
                            break;
                    }

                    gltf.images[imageId] = {
                        uri: image.uri,
                        name: imageId
                    };
                    gltf.textures[textureId] = {
                        format: format,
                        internalFormat: format,
                        sampler: samplerId,
                        source: imageId,
                        target: WebGLConstants.TEXTURE_2D,
                        type: WebGLConstants.UNSIGNED_BYTE
                    };
                }
            }

            //if (bufferSeparate) {
            //    var bufferPath = path.join(inputPath, modelName + '.bin');
            //    return fsWriteFile(bufferPath, buffer);
            //}
            return gltf;
        }

        return createGltf;
    });
    //define(function () {

    /**
    *  
    *@param {String}url
    *@param {MeteoLib.Util~successCallback}successCallback
    *@param {MeteoLib.Util~errorCallback}errorCallback
    *@memberof MeteoLib.Util
    *@static
    */
    function loadArrayBuffer(url, successCallback, errorCallback) {
        loadWithXhr.load(url, "arraybuffer", "GET", null, null, { resolve: successCallback, reject: errorCallback });
    }
    /**
    *@callback MeteoLib.Util~successCallback
    *@param {ArrayBuffer}loadedArrayBuffer
    */

    /**
    *@callback MeteoLib.Util~errorCallback
    *@param {Error}loadError
    */

    function defined(value) {
        return value !== undefined && value !== null;
    }
    var loadWithXhr = {};
    // This is broken out into a separate function so that it can be mocked for testing purposes.
    loadWithXhr.load = function (url, responseType, method, data, headers, deferred, overrideMimeType) {
        var xhr = new XMLHttpRequest();

        if (defined(overrideMimeType) && defined(xhr.overrideMimeType)) {
            xhr.overrideMimeType(overrideMimeType);
        }

        xhr.open(method, url, true);

        if (defined(headers)) {
            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            }
        }

        if (defined(responseType)) {
            xhr.responseType = responseType;
        }

        xhr.onload = function () {
            if (xhr.status < 200 || xhr.status >= 300) {
                deferred.reject(new RequestErrorEvent(xhr.status, xhr.response, xhr.getAllResponseHeaders()));
                return;
            }

            var response = xhr.response;
            var browserResponseType = xhr.responseType;

            //All modern browsers will go into either the first if block or last else block.
            //Other code paths support older browsers that either do not support the supplied responseType
            //or do not support the xhr.response property.
            if (defined(response) && (!defined(responseType) || (browserResponseType === responseType))) {
                deferred.resolve(response);
            } else if ((responseType === 'json') && typeof response === 'string') {
                try {
                    deferred.resolve(JSON.parse(response));
                } catch (e) {
                    deferred.reject(e);
                }
            } else if ((browserResponseType === '' || browserResponseType === 'document') && defined(xhr.responseXML) && xhr.responseXML.hasChildNodes()) {
                deferred.resolve(xhr.responseXML);
            } else if ((browserResponseType === '' || browserResponseType === 'text') && defined(xhr.responseText)) {
                deferred.resolve(xhr.responseText);
            } else {
                deferred.reject(new RuntimeError('Invalid XMLHttpRequest response type.'));
            }
        };

        xhr.onerror = function (e) {
            deferred.reject(new Error("请求出错" + e.data));
        };

        xhr.send(data);
    };

    //    return loadArrayBuffer;
    //})
    if (typeof module === "undefined") {
        this.loadArrayBuffer = loadArrayBuffer;
    } else {
        module.exports = loadArrayBuffer;
    }
    if (typeof define === "function") {
        define('Util/loadArrayBuffer', [], function () { return loadArrayBuffer; });
    }
    /// <reference path="../../Util/Path.js" />
    /// <reference path="../../Util/loadArrayBuffer.js" />
    define('Scene/Model/ObjLoader/loadImage', [
     //   'ThirdParty/text-encoding/text-encoding.min',
        'Util/Path',
        'Util/loadArrayBuffer'
    ], function (
        //textEncoding,
        Path,
        loadArrayBuffer
        ) {
        "use strict";

        function getChannels(colorType) {
            switch (colorType) {
                case 0: // greyscale
                    return 1;
                case 2: // RGB
                    return 3;
                case 4: // greyscale + alpha
                    return 2;
                case 6: // RGB + alpha
                    return 4;
                default:
                    return 3;
            }
        }

        function getUriType(extension) {
            switch (extension) {
                case 'png':
                    return 'data:image/png';
                case 'jpg':
                    return 'data:image/jpeg';
                case 'jpeg':
                    return 'data:image/jpeg';
                case 'gif':
                    return 'data:image/gif';
                default:
                    return 'data:image/' + extension;
            }
        }

        /**
        *
        *@param {String} imagePath
        *@return {Promise<Object>}
        *@private
        */
        function loadImage(imagePath) {

            return new Promise(function (resolve, reject) {

                loadArrayBuffer(imagePath, function (imageArrayBuffer) {

                    var data = new Uint8Array(imageArrayBuffer);
                    var extension = Path.GetExtension(imagePath).slice(1);
                    var uriType = getUriType(extension);

                    var blob = new Blob([data], { type: uriType.replace("data:", "") });
                    var fr = new FileReader();
                    fr.onload = function (e) {

                        var uri = e.target.result; //uriType + ';base64,' + b64encoded;//data.toString('base64');

                        var info = {
                            transparent: false,
                            channels: 3,
                            data: data,
                            uri: uri
                        };

                        if (extension === 'png') {
                            // Color type is encoded in the 25th bit of the png
                            var colorType = data[25];
                            var channels = getChannels(colorType);
                            info.channels = channels;
                            info.transparent = (channels === 4);
                        }
                        resolve(info);
                    };
                    fr.onerror = function (err) {
                        reject(err);
                    };
                    fr.readAsDataURL(blob);
                }, function (err) {
                    reject(err);
                })
            });

        }

        return loadImage;
    });
    /// <reference path="../../Util/loadArrayBuffer.js" />

    define('Scene/Model/ObjLoader/Material', [
       // 'ThirdParty/text-encoding/text-encoding.min',
        'Util/Path',
        'Util/loadArrayBuffer'
    ], function (
        //textEncoding,
        Path,
        loadArrayBuffer
        ) {
        "use strict";

        var defined = function (val) {
            return typeof val !== 'undefined' && val != null;
        };

        function createMaterial() {
            return {
                ambientColor: undefined,               // Ka
                emissionColor: undefined,              // Ke
                diffuseColor: undefined,               // Kd
                specularColor: undefined,              // Ks
                specularShininess: undefined,          // Ns
                alpha: undefined,                      // d / Tr
                ambientColorMap: undefined,            // map_Ka
                emissionColorMap: undefined,           // map_Ke
                diffuseColorMap: undefined,            // map_Kd
                specularColorMap: undefined,           // map_Ks
                specularShininessMap: undefined,       // map_Ns
                normalMap: undefined,                  // map_Bump
                alphaMap: undefined                    // map_d
            };
        }

        /**
       * 
       *@return {Object}
       *@private
       */
        function getDefault() {
            var material = createMaterial();
            material.diffuseColor = [0.5, 0.5, 0.5, 1.0];
            return material;
        }

        /**
        *
        *@param {String} mtlPath
        *@param {String} [encoding="utf-8"]
        *@return {Promise<Object>}
        *@private
        */
        function parse(mtlPath, encoding) {
            return new Promise(function (resolve, reject) {
                loadArrayBuffer(mtlPath, function (mtlArrayBuffer) {

                    if (!encoding) {
                        encoding = "utf-8";
                    }

                    try {

                        var decoder = new TextDecoder(encoding);
                        var contents = decoder.decode(mtlArrayBuffer, { stream: true });

                        var materials = {};
                        var material;
                        var values;
                        var value;
                        var lines = contents.split('\n');
                        var length = lines.length;
                        for (var i = 0; i < length; ++i) {
                            var line = lines[i].trim();
                            if (/^newmtl /i.test(line)) {
                                var name = line.substring(7).trim();
                                material = createMaterial();
                                materials[name] = material;
                            } else if (/^Ka /i.test(line)) {
                                values = line.substring(3).trim().split(' ');
                                material.ambientColor = [
                                    parseFloat(values[0]),
                                    parseFloat(values[1]),
                                    parseFloat(values[2]),
                                    1.0
                                ];
                            } else if (/^Ke /i.test(line)) {
                                values = line.substring(3).trim().split(' ');
                                material.emissionColor = [
                                    parseFloat(values[0]),
                                    parseFloat(values[1]),
                                    parseFloat(values[2]),
                                    1.0
                                ];
                            } else if (/^Kd /i.test(line)) {
                                values = line.substring(3).trim().split(' ');
                                material.diffuseColor = [
                                    parseFloat(values[0]),
                                    parseFloat(values[1]),
                                    parseFloat(values[2]),
                                    1.0
                                ];
                            } else if (/^Ks /i.test(line)) {
                                values = line.substring(3).trim().split(' ');
                                material.specularColor = [
                                    parseFloat(values[0]),
                                    parseFloat(values[1]),
                                    parseFloat(values[2]),
                                    1.0
                                ];
                            } else if (/^Ns /i.test(line)) {
                                value = line.substring(3).trim();
                                material.specularShininess = parseFloat(value);
                            } else if (/^d /i.test(line)) {
                                value = line.substring(2).trim();
                                material.alpha = parseFloat(value);
                            } else if (/^Tr /i.test(line)) {
                                value = line.substring(3).trim();
                                material.alpha = parseFloat(value);
                            } else if (/^map_Ka /i.test(line)) {
                                material.ambientColorMap = line.substring(7).trim();
                            } else if (/^map_Ke /i.test(line)) {
                                material.emissionColorMap = line.substring(7).trim();
                            } else if (/^map_Kd /i.test(line)) {
                                material.diffuseColorMap = line.substring(7).trim();
                            } else if (/^map_Ks /i.test(line)) {
                                material.specularColorMap = line.substring(7).trim();
                            } else if (/^map_Ns /i.test(line)) {
                                material.specularShininessMap = line.substring(7).trim();
                            } else if (/^map_Bump /i.test(line)) {
                                material.normalMap = line.substring(9).trim();
                            } else if (/^map_d /i.test(line)) {
                                material.alphaMap = line.substring(6).trim();
                            }
                        }
                        if (defined(material.alpha)) {
                            material.diffuseColor[3] = material.alpha;
                        }

                        resolve(materials);

                    } catch (err) {
                        console.log('Could not read material file at ' + mtlPath + '. Using default material instead.');
                        reject(err);
                    }
                }, function (err) {
                    reject(err);
                })
            });
        }

        var Material = {
            getDefault: getDefault,
            parse: parse
        };
        return Material;
    });
    /// <reference path="../../Util/loadArrayBuffer.js" />
    /// <reference path="../../Util/Path.js" />
    /// <reference path="image.js" />
    /// <reference path="mtl.js" />
    define('Scene/Model/ObjLoader/parseObj', [
        // 'ThirdParty/text-encoding/text-encoding.min',
        "Util/loadArrayBuffer",
        "Util/Path",
        "Scene/Model/ObjLoader/loadImage",
        "Scene/Model/ObjLoader/Material"
    ], function (
      //  textEncoding,
        loadArrayBuffer,
        Path,
        loadImage,
        Material
        ) {

        "use strict";


        var Cartesian3 = Cesium.Cartesian3;
        var defined = Cesium.defined;

        // OBJ regex patterns are from ThreeJS (https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/OBJLoader.js)

        /**
        *
        *@param {String}objUrl
        *@param {String}inputPath
        *@param {String}[encoding='utf-8']
        *@return {Promise<Object>}
        */
        function parseObj(objUrl, inputPath, encoding) {
            if (!encoding) {
                encoding = "utf-8";
            }
            return getObjInfo(objUrl, inputPath, encoding)
                .then(function (result) {
                    var info = result.info;
                    var materials = result.materials;
                    var images = result.images;
                    var allLines = result.allLines;
                    return processObj(allLines, info, materials, images, encoding);
                });
        }

        function processObj(allLines, info, materials, images) {
            return new Promise(function (resolve) {

                // A vertex is specified by indexes into each of the attribute arrays,
                // but these indexes may be different. This maps the separate indexes to a single index.
                var vertexCache = {};
                var vertexCount = 0;

                var vertexArray = [];

                var positions = [];
                var normals = [];
                var uvs = [];

                var positionMin = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
                var positionMax = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE];

                var hasNormals = info.hasNormals;
                var hasUVs = info.hasUVs;

                var materialGroups = {}; // Map material to index array
                var currentIndexArray;

                // Switch to the material-specific index array, or create it if it doesn't exist
                function useMaterial(material) {
                    if (!defined(materials[material])) {
                        useDefaultMaterial();
                    } else {
                        currentIndexArray = materialGroups[material];
                        if (!defined(currentIndexArray)) {
                            currentIndexArray = [];
                            materialGroups[material] = currentIndexArray;
                        }
                    }
                }

                function useDefaultMaterial() {
                    var defaultMaterial = 'czmDefaultMat';
                    if (!defined(materials[defaultMaterial])) {
                        materials[defaultMaterial] = Material.getDefault();
                    }
                    useMaterial(defaultMaterial);
                }

                var materialsLength = Object.keys(materials).length;
                if (materialsLength === 0) {
                    useDefaultMaterial();
                }

                function getOffset(a, data, components) {
                    var i = parseInt(a);
                    if (i < 0) {
                        // Negative vertex indexes reference the vertices immediately above it
                        return (data.length / components + i) * components;
                    }
                    return (i - 1) * components;
                }

                function createVertex(p, u, n) {
                    // Positions
                    var pi = getOffset(p, positions, 3);
                    var px = positions[pi + 0];
                    var py = positions[pi + 1];
                    var pz = positions[pi + 2];

                    positionMin[0] = Math.min(px, positionMin[0]);
                    positionMin[1] = Math.min(py, positionMin[1]);
                    positionMin[2] = Math.min(pz, positionMin[2]);
                    positionMax[0] = Math.max(px, positionMax[0]);
                    positionMax[1] = Math.max(py, positionMax[1]);
                    positionMax[2] = Math.max(pz, positionMax[2]);
                    vertexArray.push(px, py, pz);

                    // Normals
                    if (hasNormals) {
                        var ni = getOffset(n, normals, 3);
                        var nx = normals[ni + 0];
                        var ny = normals[ni + 1];
                        var nz = normals[ni + 2];
                        vertexArray.push(nx, ny, nz);
                    }

                    // UVs
                    if (hasUVs) {
                        if (defined(u)) {
                            var ui = getOffset(u, uvs, 2);
                            var ux = uvs[ui + 0];
                            var uy = uvs[ui + 1];
                            // Flip y so 0.0 is the bottom of the image
                            uy = 1.0 - uy;
                            vertexArray.push(ux, uy);
                        } else {
                            // Some objects in the model may not have uvs, fill with 0's for consistency
                            vertexArray.push(0.0, 0.0);
                        }
                    }
                }

                function addVertex(v, p, u, n) {
                    var index = vertexCache[v];
                    if (!defined(index)) {
                        index = vertexCount++;
                        vertexCache[v] = index;
                        createVertex(p, u, n);
                    }

                    return index;
                }

                function addFace(v1, p1, u1, n1, v2, p2, u2, n2, v3, p3, u3, n3, v4, p4, u4, n4) {
                    var index1 = addVertex(v1, p1, u1, n1);
                    var index2 = addVertex(v2, p2, u2, n2);
                    var index3 = addVertex(v3, p3, u3, n3);

                    currentIndexArray.push(index1);
                    currentIndexArray.push(index2);
                    currentIndexArray.push(index3);

                    // Triangulate if the face is a quad
                    if (defined(v4)) {
                        var index4 = addVertex(v4, p4, u4, n4);
                        currentIndexArray.push(index1);
                        currentIndexArray.push(index3);
                        currentIndexArray.push(index4);
                    }
                }

                // v float float float
                var vertexPattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

                // vn float float float
                var normalPattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

                // vt float float
                var uvPattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

                // f vertex vertex vertex ...
                var facePattern1 = /f( +-?\d+)\/?( +-?\d+)\/?( +-?\d+)\/?( +-?\d+)?\/?/;

                // f vertex/uv vertex/uv vertex/uv ...
                var facePattern2 = /f( +(-?\d+)\/(-?\d+)\/?)( +(-?\d+)\/(-?\d+)\/?)( +(-?\d+)\/(-?\d+)\/?)( +(-?\d+)\/(-?\d+)\/?)?/;

                // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
                var facePattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

                // f vertex//normal vertex//normal vertex//normal ...
                var facePattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;

                //var stream = byline(fs.createReadStream(objUrl, { encoding: 'utf8' }));
                //stream.on('data', function (line) {
                //var decoder = new TextDecoder(encoding)
                //var decodedText = decoder.decode(objFileArrayBuffer, { stream: true });
                //var allLines = decodedText.split(/[\r\n]+/);

                allLines.forEach(function (line) {


                    line = line.trim();
                    var result;
                    if ((line.length === 0) || (line.charAt(0) === '#')) {
                        // Don't process empty lines or comments
                    } else if ((result = vertexPattern.exec(line)) !== null) {
                        positions.push(
                            parseFloat(result[1]),
                            parseFloat(result[2]),
                            parseFloat(result[3])
                        );
                    } else if ((result = normalPattern.exec(line)) !== null) {
                        var nx = parseFloat(result[1]);
                        var ny = parseFloat(result[2]);
                        var nz = parseFloat(result[3]);
                        var normal;
                        if (nx < 0.0001 && ny < 0.0001 && nz < 0.0001) {
                            normal = Cartesian3.normalize(new Cartesian3(nx + 0.0001, ny + 0.0001, nz + 0.0001), new Cartesian3());
                        } else {
                            normal = Cartesian3.normalize(new Cartesian3(nx, ny, nz), new Cartesian3());
                        }

                        normals.push(normal.x, normal.y, normal.z);
                    } else if ((result = uvPattern.exec(line)) !== null) {
                        uvs.push(
                            parseFloat(result[1]),
                            parseFloat(result[2])
                        );
                    } else if ((result = facePattern1.exec(line)) !== null) {
                        addFace(
                            result[1], result[1], undefined, undefined,
                            result[2], result[2], undefined, undefined,
                            result[3], result[3], undefined, undefined,
                            result[4], result[4], undefined, undefined
                        );
                    } else if ((result = facePattern2.exec(line)) !== null) {
                        addFace(
                            result[1], result[2], result[3], undefined,
                            result[4], result[5], result[6], undefined,
                            result[7], result[8], result[9], undefined,
                            result[10], result[11], result[12], undefined
                        );
                    } else if ((result = facePattern3.exec(line)) !== null) {
                        addFace(
                            result[1], result[2], result[3], result[4],
                            result[5], result[6], result[7], result[8],
                            result[9], result[10], result[11], result[12],
                            result[13], result[14], result[15], result[16]
                        );
                    } else if ((result = facePattern4.exec(line)) !== null) {
                        addFace(
                            result[1], result[2], undefined, result[3],
                            result[4], result[5], undefined, result[6],
                            result[7], result[8], undefined, result[9],
                            result[10], result[11], undefined, result[12]
                        );
                    } else if (/^usemtl /.test(line)) {
                        var materialName = line.substring(7).trim();
                        useMaterial(materialName);
                    }
                });

                //stream.on('end', function () {
                resolve({
                    vertexCount: vertexCount,
                    vertexArray: vertexArray,
                    positionMin: positionMin,
                    positionMax: positionMax,
                    hasUVs: hasUVs,
                    hasNormals: hasNormals,
                    materialGroups: materialGroups,
                    materials: materials,
                    images: images
                });
                //});
            });
        }

        function getImages(inputPath, materials) {
            // Collect all the image files from the materials
            var images = [];
            for (var name in materials) {
                if (materials.hasOwnProperty(name)) {
                    var material = materials[name];
                    if (defined(material.ambientColorMap) && (images.indexOf(material.ambientColorMap) === -1)) {
                        images.push(material.ambientColorMap);
                    }
                    if (defined(material.diffuseColorMap) && (images.indexOf(material.diffuseColorMap) === -1)) {
                        images.push(material.diffuseColorMap);
                    }
                    if (defined(material.emissionColorMap) && (images.indexOf(material.emissionColorMap) === -1)) {
                        images.push(material.emissionColorMap);
                    }
                    if (defined(material.specularColorMap) && (images.indexOf(material.specularColorMap) === -1)) {
                        images.push(material.specularColorMap);
                    }
                }
            }

            // Load the image files
            var promises = [];
            var imagesInfo = {};
            var imagesLength = images.length;
            for (var i = 0; i < imagesLength; i++) {
                var imagePath = images[i];
                //if (!path.isAbsolute(imagePath)) {
                imagePath = Path.Combine(inputPath, imagePath);
                //}
                promises.push(loadImage(imagePath));
            }
            return Promise.all(promises)
                .then(function (imageInfoArray) {
                    var imageInfoArrayLength = imageInfoArray.length;
                    for (var j = 0; j < imageInfoArrayLength; j++) {
                        var image = images[j];
                        var imageInfo = imageInfoArray[j];
                        imagesInfo[image] = imageInfo;
                    }
                    return imagesInfo;
                });
        }

        function getMaterials(mtlPath, hasMaterialGroups, encoding) {
            if (hasMaterialGroups && defined(mtlPath)) {
                return Material.parse(mtlPath, encoding);
            }

            return {};
        }

        function getObjInfo(objUrl, inputPath, encoding) {
            if (!encoding) {
                encoding = "utf-8";
            }

            var mtlPath;
            var materials;
            var info;
            var hasMaterialGroups = false;
            var hasPositions = false;
            var hasNormals = false;
            var hasUVs = false;
            return new Promise(function (resolve, reject) {
                loadArrayBuffer(objUrl, function (objArrayBuffer) {
                    var decoder = new TextDecoder(encoding);
                    var decodedText = decoder.decode(objArrayBuffer, { stream: true });
                    var allLines = decodedText.split(/[\r\n]+/);

                    allLines.forEach(function (line) {

                        if (!defined(mtlPath)) {
                            var mtllibMatches = line.match(/^mtllib.*/gm);
                            if (mtllibMatches !== null) {
                                var mtlFile = mtllibMatches[0].substring(7).trim();
                                mtlPath = mtlFile;
                                //  if (!path.isAbsolute(mtlPath)) {
                                mtlPath = Path.Combine(inputPath, mtlFile);
                                //}
                            }
                        }
                        if (!hasMaterialGroups) {
                            hasMaterialGroups = /^usemtl/gm.test(line);
                        }
                        if (!hasPositions) {
                            hasPositions = /^v\s/gm.test(line);
                        }
                        if (!hasNormals) {
                            hasNormals = /^vn/gm.test(line);
                        }
                        if (!hasUVs) {
                            hasUVs = /^vt/gm.test(line);
                        }
                    });

                    if (!hasPositions) {
                        reject(new Error('Could not process OBJ file, no positions.'));
                        return;
                    }
                    info = {
                        hasNormals: hasNormals,
                        hasUVs: hasUVs
                    };


                    getMaterials(mtlPath, hasMaterialGroups, encoding).then(function (materials) {

                        getImages(inputPath, materials).then(function (images) {

                            resolve({
                                info: info,
                                materials: materials,
                                images: images,
                                allLines: allLines
                            })
                        })
                    })

                });
            });
        }

        return parseObj;
    });
    define('Scene/Model/ObjLoader/Shaders/none_frag', [], function () {

        var none_frag = "\n\
#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
\n\
varying vec3 v_position;\n\
\n\
uniform vec4 u_ambient;\n\
uniform vec4 u_diffuse;\n\
uniform vec4 u_specular;\n\
uniform float u_shininess;\n\
\n\
void main(void) \n\
{\n\
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);\n\
    vec4 ambient = u_ambient;\n\
    vec4 diffuse = u_diffuse;\n\
    vec4 specular = u_specular;\n\
    color.xyz += ambient.xyz;\n\
    color.xyz += diffuse.xyz;\n\
    color.xyz += specular.xyz;\n\
    color = vec4(color.rgb * diffuse.a, diffuse.a);\n\
    gl_FragColor = color;\n\
}";
        return none_frag;

    });
    define('Scene/Model/ObjLoader/Shaders/none_vert', [], function () {
        var none_vert = "\n\
#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
\n\
attribute vec3 a_position;\n\
\n\
uniform mat4 u_modelViewMatrix;\n\
uniform mat4 u_projectionMatrix;\n\
\n\
varying vec3 v_position;\n\
\n\
void main(void) \n\
{\n\
    vec4 pos = u_modelViewMatrix * vec4(a_position,1.0);\n\
    v_position = pos.xyz;\n\
    gl_Position = u_projectionMatrix * pos;\n\
}";
        return none_vert;
    });
    define('Scene/Model/ObjLoader/Shaders/normals_frag', [], function () {
        var normals_frag = "\n\
#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
\n\
varying vec3 v_position;\n\
varying vec3 v_normal;\n\
\n\
uniform vec4 u_ambient;\n\
uniform vec4 u_diffuse;\n\
uniform vec4 u_specular;\n\
uniform float u_shininess;\n\
uniform float u_transparency;\n\
\n\
varying vec3 v_light0Direction;\n\
\n\
void main(void) \n\
{\n\
    vec3 normal = normalize(v_normal);\n\
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);\n\
    vec3 diffuseLight = vec3(0.0, 0.0, 0.0);\n\
    vec3 lightColor = vec3(1.0,1.0,1.0);\n\
vec4 ambient = u_ambient;\n\
    vec4 diffuse = u_diffuse;\n\
    vec4 specular = u_specular;\n\
\n\
    vec3 specularLight = vec3(0.0, 0.0, 0.0);\n\
    {\n\
        float specularIntensity = 0.0;\n\
        float attenuation = 1.0;\n\
        vec3 l = normalize(v_light0Direction);\n\
        vec3 viewDir = -normalize(v_position);\n\
        vec3 h = normalize(l+viewDir);\n\
        specularIntensity = max(0.0, pow(max(dot(normal,h), 0.0) , u_shininess)) * attenuation;\n\
        specularLight += lightColor * specularIntensity;\n\
        diffuseLight += lightColor * max(dot(normal,l), 0.0) * attenuation;\n\
    }\n\
    //specular.xyz *= specularLight;\n\
    //diffuse.xyz *= diffuseLight;\n\
    color.xyz += ambient.xyz;\n\
    color.xyz += diffuse.xyz;\n\
    color.xyz += specular.xyz;\n\
    color = vec4(color.rgb * diffuse.a, diffuse.a*u_transparency);\n\
    gl_FragColor = color;\n\
}";
        return normals_frag;
    });
    define('Scene/Model/ObjLoader/Shaders/normals_vert', [], function () {
        var normals_vert = "\n\
#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
\n\
attribute vec3 a_position;\n\
attribute vec3 a_normal;\n\
\n\
uniform mat3 u_normalMatrix;\n\
uniform mat4 u_modelViewMatrix;\n\
uniform mat4 u_projectionMatrix;\n\
\n\
varying vec3 v_position;\n\
varying vec3 v_normal;\n\
\n\
varying vec3 v_light0Direction;\n\
\n\
void main(void) \n\
{\n\
    vec4 pos = u_modelViewMatrix * vec4(a_position,1.0);\n\
    v_normal = u_normalMatrix * a_normal;\n\
    v_position = pos.xyz;\n\
    v_light0Direction = mat3(u_modelViewMatrix) * vec3(1.0,1.0,1.0);\n\
    gl_Position = u_projectionMatrix * pos;\n\
}";

        return normals_vert;
    });
    define('Scene/Model/ObjLoader/Shaders/texture_frag', [], function () {
        var texture_frag = "\n\
#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
\n\
varying vec3 v_position;\n\
varying vec2 v_texcoord0;\n\
\n\
uniform vec4 u_ambient;\n\
uniform sampler2D u_diffuse;\n\
uniform vec4 u_specular;\n\
uniform float u_shininess;\n\
\n\
uniform float u_transparency;\n\
\n\
void main(void) \n\
{\n\
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);\n\
    vec3 diffuseLight = vec3(0.0, 0.0, 0.0);\n\
    vec3 lightColor = vec3(1.0,1.0,1.0);\n\
    vec4 ambient = u_ambient;\n\
    vec4 diffuse = texture2D(u_diffuse, v_texcoord0);\n\
    vec4 specular = u_specular;\n\
    color.xyz += ambient.xyz;\n\
    color.xyz += diffuse.xyz;\n\
    color.xyz += specular.xyz;\n\
    color = vec4(diffuse.rgb * diffuse.a, diffuse.a*u_transparency);\n\
    gl_FragColor = color;\n\
}";
        return texture_frag;
    })
    ;
    define('Scene/Model/ObjLoader/Shaders/texture_vert', [], function () {
        var texture_vert = "\n\
#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
\n\
attribute vec3 a_position;\n\
attribute vec2 a_texcoord0;\n\
\n\
uniform mat4 u_modelViewMatrix;\n\
uniform mat4 u_projectionMatrix;\n\
\n\
varying vec3 v_position;\n\
varying vec2 v_texcoord0;\n\
\n\
void main(void) \n\
{\n\
    vec4 pos = u_modelViewMatrix * vec4(a_position,1.0);\n\
    v_texcoord0 = a_texcoord0;\n\
    v_position = pos.xyz;\n\
    gl_Position = u_projectionMatrix * pos;\n\
}";

        return texture_vert;
    });
    define('Scene/Model/ObjLoader/Shaders/texture_normals_frag', [], function () {
        var texture_normals_frag = "\n\
#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
\n\
varying vec3 v_position;\n\
varying vec2 v_texcoord0;\n\
varying vec3 v_normal;\n\
\n\
uniform vec4 u_ambient;\n\
uniform vec4 u_specular;\n\
uniform float u_shininess;\n\
\n\
uniform sampler2D u_diffuse;\n\
\n\
varying vec3 v_light0Direction;\n\
\n\
void main(void) \n\
{\n\
    vec3 normal = normalize(v_normal);\n\
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);\n\
    vec3 diffuseLight = vec3(0.0, 0.0, 0.0);\n\
    vec3 lightColor = vec3(1.0,1.0,1.0);\n\
    vec4 ambient = u_ambient;\n\
    vec4 diffuse = texture2D(u_diffuse, v_texcoord0);\n\
    vec4 specular = u_specular;\n\
\n\
    vec3 specularLight = vec3(0.0, 0.0, 0.0);\n\
    {\n\
        float specularIntensity = 0.0;\n\
        float attenuation = 1.0;\n\
        vec3 l = normalize(v_light0Direction);\n\
        vec3 viewDir = -normalize(v_position);\n\
        vec3 h = normalize(l+viewDir);\n\
        specularIntensity = max(0.0, pow(max(dot(normal,h), 0.0) , u_shininess)) * attenuation;\n\
        specularLight += lightColor * specularIntensity;\n\
        diffuseLight += lightColor * max(dot(normal,l), 0.0) * attenuation;\n\
    }\n\
    //specular.xyz *= specularLight;\n\
    //diffuse.xyz *= diffuseLight;\n\
    color.xyz += ambient.xyz;\n\
    color.xyz += diffuse.xyz;\n\
    color.xyz += specular.xyz;\n\
    color = vec4(diffuse.rgb * diffuse.a, diffuse.a);\n\
    gl_FragColor = color;\n\
}";

        return texture_normals_frag;
    });
    define('Scene/Model/ObjLoader/Shaders/texture_normals_vert', [], function () {
        var texture_normals_vert = "\n\
#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
\n\
attribute vec3 a_position;\n\
attribute vec2 a_texcoord0;\n\
attribute vec3 a_normal;\n\
\n\
uniform mat3 u_normalMatrix;\n\
uniform mat4 u_modelViewMatrix;\n\
uniform mat4 u_projectionMatrix;\n\
\n\
varying vec3 v_position;\n\
varying vec2 v_texcoord0;\n\
varying vec3 v_normal;\n\
\n\
varying vec3 v_light0Direction;\n\
\n\
void main(void) \n\
{\n\
    vec4 pos = u_modelViewMatrix * vec4(a_position,1.0);\n\
    v_normal = u_normalMatrix * a_normal;\n\
    v_texcoord0 = a_texcoord0;\n\
    v_position = pos.xyz;\n\
    v_light0Direction = mat3(u_modelViewMatrix) * vec3(1.0,1.0,1.0);\n\
    gl_Position = u_projectionMatrix * pos;\n\
}";
        return texture_normals_vert;
    });
    define('Scene/Model/ObjLoader/TechniqueHandler', [
        "Scene/Model/ObjLoader/Shaders/none_frag",
        "Scene/Model/ObjLoader/Shaders/none_vert",
        "Scene/Model/ObjLoader/Shaders/normals_frag",
        "Scene/Model/ObjLoader/Shaders/normals_vert",
        "Scene/Model/ObjLoader/Shaders/texture_frag",
        "Scene/Model/ObjLoader/Shaders/texture_vert",
        "Scene/Model/ObjLoader/Shaders/texture_normals_frag",
        "Scene/Model/ObjLoader/Shaders/texture_normals_vert"
    ], function (
        none_frag,
        none_vert,
        normals_frag,
        normals_vert,
        texture_frag,
        texture_vert,
        texture_normals_frag,
        texture_normals_vert
        ) {
        /*
            * Javascript base64encode() base64加密函数
              用于生成字符串对应的base64加密字符串
            * 吴先成  www.51-n.com ohcc@163.com QQ:229256237
            * @param string input 原始字符串
            * @return string 加密后的base64字符串
           */
        function base64Encode(input) {
            var rv;
            rv = encodeURIComponent(input);
            rv = unescape(rv);
            rv = window.btoa(rv);
            return rv;
        }

        /*
         * Javascript base64Decode() base64解密函数
           用于解密base64加密的字符串
         * 吴先成  www.51-n.com ohcc@163.com QQ:229256237
         * @param string input base64加密字符串
         * @return string 解密后的字符串
        */
        function base64Decode(input) {
            rv = window.atob(input);
            rv = escape(rv);
            rv = decodeURIComponent(rv);
            return rv;
        }

        var pref = "data:text/plain;base64,";
        none_frag = base64Encode(none_frag);// pref + window.at(none_frag);
        none_vert = base64Encode(none_vert);//pref + window.btoa(none_vert),
        normals_frag = pref + window.btoa(normals_frag),
        normals_vert = pref + window.btoa(normals_vert),
        texture_frag = pref + window.btoa(texture_frag),
        texture_vert = pref + window.btoa(texture_vert),
        texture_normals_frag = pref + base64Encode(texture_normals_frag);//pref + window.btoa(texture_normals_frag),
        texture_normals_vert = pref + base64Encode(texture_normals_vert);//pref + window.btoa(texture_normals_vert);

        var WebGLConstants = Cesium.WebGLConstants;
        /**
         * A class for managing the {@link Technique}s that may be required for
         * rendering data that is contained in an OBJ file. It allows obtaining
         * the {@link Technique}s for elements with and without textures and
         * normals, and adds the required {@link Program}s and {@link Shader}s
         * to a {@link GlTF} when the IDs of the corresponding {@link Technique}s
         * are requested 
         * 
        
           * Create a new technique handler
           * @param gltf The {@link GlTF} that will receive the {@link Technique}s, 
           * {@link Program}s and {@link Shader}s that are created by this instance
           * upon request 
           */
        function TechniqueHandler(gltf) {
            this.gltf = gltf;
        }
        /**
         * The ID of the {@link Technique} that has a texture and normals
         */
        TechniqueHandler.TECHNIQUE_TEXTURE_NORMALS_ID =
                "techniqueTextureNormals";

        /**
        * The ID of the {@link Technique} that has a png texture   and normals 
        */
        TechniqueHandler.TECHNIQUE_TEXTURE_NORMALS_ID_TRANSPARENT =
                "techniqueTextureNormalsTransparent";

        /**
         * The ID of the {@link Technique} that has a png texture
         */
        TechniqueHandler.TECHNIQUE_TEXTURE_ID_TRANSPARENT =
                "techniqueTextureTransparent";

        /**
        * The ID of the {@link Technique} that has a texture
        */
        TechniqueHandler.TECHNIQUE_TEXTURE_ID =
                "techniqueTexture";

        /**
         * The ID of the {@link Technique} that has normals
         */
        TechniqueHandler.TECHNIQUE_NORMALS_ID =
                "techniqueNormals";

        /**
         * The ID of the {@link Technique} that has neither a texture nor normals
         */
        TechniqueHandler.TECHNIQUE_NONE_ID =
                "techniqueNone";

        /**
         * The name for the <code>"ambient"</code> 
         * {@link Technique#getParameters() technique parameter}
         */
        TechniqueHandler.AMBIENT_NAME = "ambient";

        /**
         * The name for the <code>"diffuse"</code> 
         * {@link Technique#getParameters() technique parameter}
         */
        TechniqueHandler.DIFFUSE_NAME = "diffuse";

        /**
         * The name for the <code>"specular"</code> 
         * {@link Technique#getParameters() technique parameter}
         */
        TechniqueHandler.SPECULAR_NAME = "specular";

        /**
         * The name for the <code>"shininess"</code> 
         * {@link Technique#getParameters() technique parameter}
         */
        TechniqueHandler.SHININESS_NAME = "shininess";

        TechniqueHandler.TRANAPARENCY_NAME = "transparency";





        /**
         * Returns the ID of the {@link Technique} with the given properties.
         * If the corresponding {@link Technique} was not created yet, it will
         * be created, and will be added to the {@link GlTF} that was given
         * in the constructor, together with the {@link Program} and 
         * {@link Shader} instances
         * 
         * @param withTexture Whether the {@link Technique} should support a texture
         * @param withNormals Whether the {@link Technique} should support normals
         * @return The {@link Technique} ID
         */
        TechniqueHandler.prototype.getTechniqueId = function (withTexture, withNormals, transparent) {
            if (withTexture && withNormals) {
                var techniqueId = transparent ? TechniqueHandler.TECHNIQUE_TEXTURE_NORMALS_ID_TRANSPARENT : TechniqueHandler.TECHNIQUE_TEXTURE_NORMALS_ID;
                var vertexShaderUri = texture_normals_vert;// "texture_normals.vert"; 
                var fragmentShaderUri = texture_normals_frag;  //"texture_normals.frag";
                this.createTechnique(techniqueId,
                     withTexture, withNormals,
                     vertexShaderUri, fragmentShaderUri, transparent);
                return techniqueId;

            }
            if (withTexture && !withNormals) {
                var techniqueId = transparent ? TechniqueHandler.TECHNIQUE_TEXTURE_ID_TRANSPARENT : TechniqueHandler.TECHNIQUE_TEXTURE_ID;
                var vertexShaderUri = texture_vert;//"texture.vert";
                var fragmentShaderUri = texture_frag;// "texture.frag";
                this.createTechnique(techniqueId,
                    withTexture, withNormals,
                    vertexShaderUri, fragmentShaderUri, transparent);
                return techniqueId;
            }
            if (!withTexture && withNormals) {
                var techniqueId = TechniqueHandler.TECHNIQUE_NORMALS_ID;
                var vertexShaderUri = normals_vert;// "normals.vert";
                var fragmentShaderUri = normals_frag;//"normals.frag";
                this.createTechnique(techniqueId,
                    withTexture, withNormals,
                    vertexShaderUri, fragmentShaderUri, false);
                return techniqueId;
            }
            else {
                var techniqueId = TechniqueHandler.TECHNIQUE_NONE_ID;
                var vertexShaderUri = none_vert;// "none.vert";
                var fragmentShaderUri = none_frag;// "none.frag";
                this.createTechnique(techniqueId,
                    withTexture, withNormals,
                    vertexShaderUri, fragmentShaderUri, false);
                return techniqueId;
            }

        };

        function generateId(prefix, map) {
            var set = [];
            var counter = 0;
            if (map != null) {
                for (var i in map) {

                    if (map.hasOwnProperty(i)) {
                        set.push(i);
                        counter++;
                    }
                }
            }

            while (true) {
                var id = prefix + counter;
                if (set.indexOf(id) < 0) {
                    return id;
                }
                counter++;
            }
        }

        /**
         * Create the specified {@link Technique}, if it does not exist
         * yet, and add it to the the {@link GlTF} that was given in 
         * the constructor, together with its {@link Program} and 
         * {@link Shader}s  
         * 
         * @param techniqueId The {@link Technique} ID
         * @param withTexture Whether the {@link Technique} should support a texture
         * @param withNormals Whether the {@link Technique} should support normals
         * @param vertexShaderUri The {@link Shader#getUri() vertex shader URI}
         * @param fragmentShaderUri The {@link Shader#getUri() fragment shader URI}
         */
        TechniqueHandler.prototype.createTechnique = function (techniqueId,
            withTexture, withNormals,
            vertexShaderUri, fragmentShaderUri, transparent) {
            if (!this.gltf.techniques) {
                this.gltf.techniques = {};
            }
            var techniques = this.gltf.techniques;
            var technique = null;
            if (techniques != null) {
                if (techniques.hasOwnProperty(techniqueId)) {
                    technique = techniques[techniqueId];
                    return;
                }
            } else {
                this.gltf.techniques = {};
            }
            if (!this.gltf.programs) {
                this.gltf.programs = {};
            }
            var programId = generateId("program", this.gltf.programs);

            if (!this.gltf.shaders) {
                this.gltf.shaders = {};
            }
            var vertexShaderId = generateId(
               "vertexShader_for_" + programId, this.gltf.shaders);
            var vertexShader = {
                uri: vertexShaderUri,
                type: WebGLConstants.VERTEX_SHADER,
                name: vertexShaderId
            };

            this.gltf.shaders[vertexShaderId] = vertexShader;

            var fragmentShaderId = generateId(
                "fragmentShader_for_" + programId, this.gltf.shaders);
            var fragmentShader = {
                uri: fragmentShaderUri,
                type: WebGLConstants.FRAGMENT_SHADER,
                name: fragmentShaderId
            };
            this.gltf.shaders[fragmentShaderId] = fragmentShader;

            var program = {
                attributes: [],
                fragmentShader: fragmentShaderId,
                vertexShader: vertexShaderId
            };

            var programAttributes = [];
            programAttributes.push("a_position");
            if (withTexture) {
                programAttributes.push("a_texcoord0");
            }
            if (withNormals) {
                programAttributes.push("a_normal");
            }
            program.attributes = programAttributes;
            this.gltf.programs[programId] = program;


            technique = {
                parameters: null,
                attributes: null,
                program: null,
                uniforms: null,
                states: null,
            };
            technique.program = programId;

            var techniqueAttributes = {};
            techniqueAttributes["a_position"] = "position";
            if (withTexture) {
                techniqueAttributes["a_texcoord0"] = "texcoord0";
            }
            if (withNormals) {
                techniqueAttributes["a_normal"] = "normal";
            }
            technique.attributes = techniqueAttributes;


            var techniqueParameters = {};

            techniqueParameters["position"] =
                createTechniqueParameters(
                WebGLConstants.FLOAT_VEC3, "POSITION");

            if (withTexture) {
                techniqueParameters["texcoord0"] =
                    createTechniqueParameters(
                        WebGLConstants.FLOAT_VEC2, "TEXCOORD_0");
            }
            if (withNormals) {
                techniqueParameters["normal"] =
                    createTechniqueParameters(
                        WebGLConstants.FLOAT_VEC3, "NORMAL");
            }

            techniqueParameters["modelViewMatrix"] =
                createTechniqueParameters(
                    WebGLConstants.FLOAT_MAT4,
                    Semantic.MODELVIEW);
            if (withNormals) {
                techniqueParameters["normalMatrix"] =
                    createTechniqueParameters(
                        WebGLConstants.FLOAT_MAT3,
                        Semantic.MODELVIEWINVERSETRANSPOSE);
            }
            techniqueParameters["projectionMatrix"] =
                createTechniqueParameters(
                    WebGLConstants.FLOAT_MAT4,
                    Semantic.PROJECTION);

            techniqueParameters[TechniqueHandler.AMBIENT_NAME] =
                createTechniqueParameters(
                    WebGLConstants.FLOAT_VEC4);
            if (withTexture) {
                techniqueParameters[TechniqueHandler.DIFFUSE_NAME] =
                    createTechniqueParameters(
                        WebGLConstants.SAMPLER_2D);
            }
            else {
                techniqueParameters[TechniqueHandler.DIFFUSE_NAME]=
                createTechniqueParameters(
                    WebGLConstants.FLOAT_VEC4);
            }
            techniqueParameters[TechniqueHandler.SPECULAR_NAME] =
                createTechniqueParameters(
                    WebGLConstants.FLOAT_VEC4);

            techniqueParameters[TechniqueHandler.SHININESS_NAME] =
                createTechniqueParameters(
                    WebGLConstants.FLOAT);

            techniqueParameters[TechniqueHandler.TRANAPARENCY_NAME] =
                 createTechniqueParameters(
                     WebGLConstants.FLOAT);

            technique.parameters = techniqueParameters;

            var techniqueUniforms = {};
            techniqueUniforms["u_ambient"] = TechniqueHandler.AMBIENT_NAME;
            techniqueUniforms["u_diffuse"] = TechniqueHandler.DIFFUSE_NAME;
            techniqueUniforms["u_specular"] = TechniqueHandler.SPECULAR_NAME;
            techniqueUniforms["u_shininess"] = TechniqueHandler.SHININESS_NAME;
            techniqueUniforms["u_transparency"] = TechniqueHandler.TRANAPARENCY_NAME;
            techniqueUniforms["u_modelViewMatrix"] = "modelViewMatrix";
            if (withNormals) {
                techniqueUniforms["u_normalMatrix"] = "normalMatrix";
            }
            techniqueUniforms["u_projectionMatrix"] = "projectionMatrix";
            technique.uniforms = techniqueUniforms;

            var states = {
                enable: [],
                functions: {}
            };
            states.enable.push(WebGLConstants.DEPTH_TEST);//深度测试
            states.enable.push(WebGLConstants.CULL_FACE); //剔除遮挡
            if (transparent) {
                states.enable.push(WebGLConstants.BLEND);//混合
            }

            technique.states = states;

            this.gltf.techniques[techniqueId] = technique;
        };

        /**
         * Create a {@link TechniqueParameters} object that has the given 
         * {@link TechniqueParameters#getType() type} and
         * {@link TechniqueParameters#getSemantic() semantic}
         * 
         * @param type The type
         * @param semantic The semantic
         * @return The {@link TechniqueParameters}
         */
        function createTechniqueParameters(type, semantic) {
            if (arguments.length == 1) {
                return { type: type };
            }
            else {
                return {
                    type: type,
                    semantic: semantic
                };
            }
        }

        function Semantic()
        { }
        /**
         * The LOCAL semantic
         */
        Semantic.LOCAL = "LOCAL";

        /**
         * The MODEL semantic
         */
        Semantic.MODEL = "MODEL";

        /**
         * The VIEW semantic
         */
        Semantic.VIEW = "VIEW";

        /**
         * The PROJECTION semantic
         */
        Semantic.PROJECTION = "PROJECTION";

        /**
         * The MODELVIEW semantic
         */
        Semantic.MODELVIEW = "MODELVIEW";

        /**
         * The MODELVIEWPROJECTION semantic
         */
        Semantic.MODELVIEWPROJECTION = "MODELVIEWPROJECTION";

        /**
         * The MODELINVERSE semantic
         */
        Semantic.MODELINVERSE = "MODELINVERSE";

        /**
         * The VIEWINVERSE semantic
         */
        Semantic.VIEWINVERSE = "VIEWINVERSE";

        /**
         * The MODELVIEWINVERSE semantic
         */
        Semantic.MODELVIEWINVERSE = "MODELVIEWINVERSE";

        /**
         * The PROJECTIONINVERSE semantic
         */
        Semantic.PROJECTIONINVERSE = "PROJECTIONINVERSE";

        /**
         * The MODELVIEWPROJECTIONINVERSE semantic
         */
        Semantic.MODELVIEWPROJECTIONINVERSE = "MODELVIEWPROJECTIONINVERSE";

        /**
         * The MODELINVERSETRANSPOSE semantic
         */
        Semantic.MODELINVERSETRANSPOSE = "MODELINVERSETRANSPOSE";

        /**
         * The MODELVIEWINVERSETRANSPOSE semantic
         */
        Semantic.MODELVIEWINVERSETRANSPOSE = "MODELVIEWINVERSETRANSPOSE";

        /**
         * The VIEWPORT semantic
         */
        Semantic.VIEWPORT = "VIEWPORT";

        /**
         * The JOINTMATRIX semantic
         */
        Semantic.JOINTMATRIX = "JOINTMATRIX";


        /**
         * Returns whether the given string is a valid semantic name, and may be
         * passed to <code>Semantic.valueOf</code> without causing an exception.
         * 
         * @param s The string
         * @return Whether the given string is a valid semantic
         */
        Semantic.contains = function (s) {
            switch (s) {
                case Semantic.JOINTMATRIX:
                case Semantic.LOCAL:
                case Semantic.MODEL:
                case Semantic.MODELINVERSE:
                case Semantic.MODELINVERSETRANSPOSE:
                case Semantic.MODELVIEW:
                case Semantic.MODELVIEWINVERSE:
                case Semantic.MODELVIEWINVERSETRANSPOSE:
                case Semantic.MODELVIEWPROJECTION:
                case Semantic.MODELVIEWPROJECTIONINVERSE:
                case Semantic.PROJECTION:
                case Semantic.PROJECTIONINVERSE:
                case Semantic.VIEW:
                case Semantic.VIEWINVERSE:
                case Semantic.VIEWPORT:
                    return true;
            }

            return false;
        };

        return TechniqueHandler;

    });
    define('Scene/Model/ObjLoader/ObjLoader', [
        'Scene/Model/ObjLoader/createGltf',
        'Scene/Model/ObjLoader/parseObj',
        'Util/Path',
        'Scene/Model/ObjLoader/TechniqueHandler'
    ], function (
        createGltf,
        parseObj,
        Path,
        TechniqueHandler
        ) {

        /**
        *
        *@class
        *@memberof MeteoLib.Scene.Model
        *@example
                ObjLoader.load("./人民英雄纪念碑/rmyx.obj").then(function (gltf) {
                    var center = Cesium.Cartesian3.fromDegrees(116.391402337129, 39.9031909, 0)
                    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    
                    var model = new Cesium.Model({
                        gltf: gltf, 
                        minimumPixelSize: 256,
                        modelMatrix: modelMatrix,
                        scene: viewer.scene,
                        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                    });
                    viewer.scene.primitives.add(model);
                    model.readyPromise.then(function () {
                        viewer.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(116.391402337129, 39.9031909, 1000)
                        });
                    })
                    console.log(gltf);
                });
        */
        var ObjLoader = {
            load: function load(objUrl) {

                var path = Path.GetDirectoryName(objUrl) + "/";
                var name = Path.ChangeExtension(Path.GetFileName(objUrl), "");

                return parseObj(objUrl, path).then(function (obj) {
                    var gltf = createGltf(obj, path, name);
                    var th = new TechniqueHandler(gltf);

                    for (var meshId in gltf.meshes) {
                        var primitives = gltf.meshes[meshId].primitives;
                        primitives.forEach(function (primitive) {
                            var withNormals = typeof primitive.attributes.NORMAL !== 'undefined';
                            var withTexture = false;
                            var transparent = false;

                            var mtl = gltf.materials[primitive.material];
                            for (var mtlVal in mtl.values) {
                                if (typeof mtl.values[mtlVal] === 'string') {
                                    withTexture = true;
                                    transparent = gltf.textures[mtl.values[mtlVal]].format == Cesium.WebGLConstants.RGBA;
                                }
                            }
                            var techniqueId = th.getTechniqueId(withTexture, withNormals, transparent);
                            mtl.technique = techniqueId;
                            mtl.values["transparency"] = 1.0;
                        })
                    }
                    th = null;
                    return gltf;
                })
            }
        };

        return ObjLoader;
    });


    require([
               'Scene/Model/ObjLoader/ObjLoader'
    ], function (
                ObjLoader) {
        'use strict';
        /*global self*/
        var scope = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {};

        scope.ObjLoader = ObjLoader;

    }, undefined, true);

})();
if (typeof define === "function") {
    define(function () {
        var newObjLoader = ObjLoader;
        ObjLoader = undefined;
        return newObjLoader;
    });
} else if (typeof module === "undefined") {
    window.ObjLoader = ObjLoader;
} else {
    module.exports = ObjLoader;
}