var file = document.getElementById('file');
var path;
file.addEventListener('change', function (event) {
    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.type.match('svg')) {
            project.importSVG(file, options.expandShapes, function(item){
                console.log(item);
            });
        }
    }
});

