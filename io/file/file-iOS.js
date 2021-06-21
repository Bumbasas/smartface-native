const FileStream = require('../../io/filestream');

function File(params) {
    var self = this;

    Object.defineProperties(this, {
        'creationDate': {
            get: function() {
                return self.nativeObject.getCreationDate();
            },
        },
        'exists': {
            get: function() {
                return self.nativeObject.exist();
            },
        },
        'extension': {
            get: function() {
                return self.nativeObject.getExtension();
            },
        },
        'isDirectory': {
            get: function() {
                return self.nativeObject.isDirectory();
            },
        },
        'isFile': {
            get: function() {
                return self.nativeObject.isFile();
            },
        },
        'modifiedDate': {
            get: function() {
                return self.nativeObject.getModifiedDate();
            },
        },
        'name': {
            get: function() {
                return self.nativeObject.getName();
            },
        },
        'parent': {
            get: function() {
                var parentNativeObject = self.nativeObject.getParent();
                var parent = new File();
                parent.nativeObject = parentNativeObject;
                return parent;
            },
        },
        'path': {
            get: function() {
                return self.nativeObject.getPath();
            },
            set: function(value) {
                self.nativeObject = __SF_File.create(value);
            }
        },
        'size': {
            get: function() {
                return self.nativeObject.getSize();
            },
        },
        'writable': {
            get: function() {
                return self.nativeObject.isWritable();
            },
        },
    });

    this.copy = function(destination) {
        return self.nativeObject.copy(destination);
    }

    this.ios = {};

    this.ios.getNSURL = function() {
        if (self.nativeObject.getActualPath()) {
            return __SF_NSURL.fileURLWithPath(self.nativeObject.getActualPath());
        } else {
            return __SF_NSURL.URLWithString(self.nativeObject.getPath());
        }
    };

    this.createDirectory = function(withParents) {
        var value = true;
        if (typeof withParents === 'boolean') {
            value = withParents;
        }
        return self.nativeObject.createDirectory(value);
    };

    this.createFile = function(createParents) {
        var value = true;
        if (typeof createParents === 'boolean') {
            value = createParents;
        }
        return self.nativeObject.createFile(value);
    };

    this.remove = function(withChilds) {
        var value = true;
        if (typeof withChilds === 'boolean') {
            value = withChilds;
        }
        return self.nativeObject.remove(value);
    };

    this.getFiles = function(nameFilter, typeFilter) {
        var filterValue = "";
        if (typeof nameFilter === 'string') {
            filterValue = nameFilter;
        }

        var typeValue = 0;
        if (typeof typeFilter === 'number') {
            typeValue = typeFilter;
        }

        var fileObjectArray = [];
        var nativeObjectArray = self.nativeObject.getFiles(filterValue, typeValue);
        nativeObjectArray.forEach(function(item) {
            var file = new File();
            file.nativeObject = item;
            fileObjectArray.push(file);
        });

        return fileObjectArray;
    };

    this.move = function(destination) {
        return self.nativeObject.move(destination);
    };

    this.rename = function(newName) {
        return self.nativeObject.rename(newName);
    };

    this.openStream = function(type, contentMode) {
        return FileStream.create(self.nativeObject.getActualPath(), type, contentMode);
    };

    this.getAbsolutePath = function() {
        return self.nativeObject.getActualPath();
    }

    // Assign parameters given in constructor
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
};

File.getDocumentsDirectory = function() {
    return __SF_File.getDocumentsDirectory();
};

File.getMainBundleDirectory = function() {
    return __SF_File.getMainBundleDirectory();
};

module.exports = File;