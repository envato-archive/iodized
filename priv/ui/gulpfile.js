var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var sass = require('gulp-ruby-sass');
var del = require('del');

gulp.task("default", ["build"]);

gulp.task("build-dev", ["clean-public", "webpack:build-dev", "sass", "images", "html", "css"], function() {
  gulp.watch(["app/js/**/*"], ["webpack:build-dev"]);
  gulp.watch(["app/sass/**/*"], ["sass"]);
  gulp.watch(["app/img/**/*"], ["images"]);
  gulp.watch(["app/**/*.html"], ["html"]);
  gulp.watch(["app/css/**/*"], ["css"]);
});

// Production build
gulp.task("build", ["clean-public", "webpack:build", "sass", "images", "html", "css"]);

gulp.task("clean-public", function() {
  del(["!public/*"], function(err) {
    if (err !== undefined) {
      console.log("Problem cleaning public=" + err);
    }
  });
});

gulp.task("webpack:build", function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
    "process.env": {
      // This has effect on the react lib size
      "NODE_ENV": JSON.stringify("production")
    }
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
  // run webpack
  devCompiler.run(function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build-dev", err);
    gutil.log("[webpack:build-dev]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('sass', function () {
  return gulp.src('app/sass/main.sass')
    .pipe(sass())
    .on('error', function (err) { console.log(err.message); })
    .pipe(gulp.dest('public/css'));
});

gulp.task("images", function() {
  return gulp.src("app/img/*")
    .pipe(gulp.dest('public/img'));
});

gulp.task("html", function() {
  return gulp.src("app/**/*.html")
    .pipe(gulp.dest('public'));
});

gulp.task("css", function() {
  return gulp.src("app/css/**/*")
    .pipe(gulp.dest('public/css'));
});
