import { Meteor } from 'meteor/meteor';

function fromDir(startPath,filter){
    var fs=require('fs');
    var path = require('path');

    var output = [];

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            output.push(filename);
        };
    };
    return output;
};

Meteor.startup(() => {
    var http = require('http'),
    fileSystem = require('fs'),
    path = require('path')
    util = require('util');

    var songs = fromDir('H:\\Users\\Steven\\Documents\\Music','.mp3');

    http.createServer(function(request, response) {
        var filePath = songs[Math.floor(Math.random()*songs.length)];
        var stat = fileSystem.statSync(filePath);

        response.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });

        var readStream = fileSystem.createReadStream(filePath);
        // We replaced all the event handlers with a simple call to util.pump()
        util.pump(readStream, response);
    })
        .listen(2000);
});
