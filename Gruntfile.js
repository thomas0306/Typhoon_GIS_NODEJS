module.exports = function(grunt) {
    // Configuration, Tasks and Plugins.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserSync: {
            bsFiles: {
                src : [
                    'stylesheets/*.css',
                    'javascripts/*.js',
                    'static/*.html'
                ],
            },
            options: {
                server: {
                    proxy: "localhost:3000",
                    index: '/'
                    //watchTask: true,
                    //baseDir: 'public',
                    //index: 'static/information.html'
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask('default', ['browserSync']);
};