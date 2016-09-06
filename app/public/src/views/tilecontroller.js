//
//  HTML5 PivotViewer
//
//  Original Code:
//    Copyright ( C ) 2011 LobsterPot Solutions - http://www.lobsterpot.com.au/
//    enquiries@lobsterpot.com.au
//
//  Enhancements:
//    Copyright ( C ) 2012-2014 OpenLink Software - http://www.openlinksw.com/
//
//  This software is licensed under the terms of the
//  GNU General Public License v2 ( see COPYING )
//
///
/// Tile Controller
/// used to create the initial tiles and their animation based on the locations set in the views
///
PivotViewer.Views.TileController = Object.subClass({
    init: function(ImageController) {
        this._tiles = [];
        this._tilesById = [];
        this._easing = new Easing.Easer({
            type: "circular",
            side: "both"
        });
        this._imageController = ImageController;

        var that = this;
        this._tiles.push = function(x) {
            this.__proto__.push.apply(that._tiles, [x]);
            that._tilesById[x.item.id] = x;
        }
    },
    getTileById: function(id) {
        var item = this._tilesById[id];
        if (item == undefined) return null;
        return item;
    },
    initTiles: function(pivotCollectionItems, baseCollectionPath, canvasContext) {
        for (var i = 0; i < pivotCollectionItems.length; i++) {

            var tile = new PivotViewer.Views.Tile(this._imageController);
            tile.item = pivotCollectionItems[i];
            this._canvasContext = canvasContext;
            tile.context = this._canvasContext;
            tileLocation = new PivotViewer.Views.TileLocation();
            tile._locations.push(tileLocation);
            this._tiles.push(tile);

        }
        return this._tiles;
    },

    animateTiles: function() {

        var that = this;
        this._started = true;
        var context = null;
        var tiles = this._tiles;

        if (tiles.length > 0 && tiles[0].context != null) {

            context = tiles[0].context;
            //update canvas information while window size changes

            var cwidth = context.canvas.width = $('.pv-canvas').width();
            var cheight = context.canvas.height = $('.pv-canvas').height();

            var isZooming = false;

            //Set tile properties

            for (var i = 0; i < tiles.length; i++) {

                var tile = tiles[i];
                var locations = tile._locations;

                //for each tile location...

                for (l = 0; l < locations.length; l++) {

                    var location = locations[l];

                    var now = PivotViewer.Utils.now() - tile.start;
                    var end = tile.end - tile.start;
                    //use the easing function to determine the next position
                    if (now <= end) {

                        //if the position is different from the
                        //destination position then zooming is
                        //happening

                        if (location.x != location.destinationx ||
                            location.y != location.destinationy)
                            isZooming = true;

                        location.x =
                            this._easing.ease(now, // curr time
                                location.startx, // start position
                                location.destinationx -
                                location.startx, // relative end position
                                end); // end time

                        location.y =
                            this._easing.ease(now,
                                location.starty,
                                location.destinationy -
                                location.starty,
                                end);

                        //if the width/height is different from the
                        //destination width/height then zooming is
                        //happening

                        if (tile.width != tile.destinationWidth ||
                            tile.height != tile.destinationHeight)
                            isZooming = true;

                        tile.width =
                            this._easing.ease(now,
                                tile.startwidth,
                                tile.destinationwidth -
                                tile.startwidth,
                                end);

                        tile.height =
                            this._easing.ease(now,
                                tile.startheight,
                                tile.destinationheight -
                                tile.startheight,
                                end);

                    } else {
                        location.x = location.destinationx;
                        location.y = location.destinationy;
                        tile.width = tile.destinationwidth;
                        tile.height = tile.destinationheight;

                        // if now and end are numbers when we get here
                        // then the animation has finished

                    }

                    //check if the destination will be in the visible area
                    if ((location.destinationx + tile.destinationwidth < 0) ||
                        (location.destinationx > cwidth) ||
                        (location.destinationy + tile.destinationheight < 0) ||
                        (location.destinationy > cheight))
                        tile.destinationVisible = false;
                    else
                        tile.destinationVisible = true;

                }
            }
        }

        //fire zoom event

        if (this._isZooming != isZooming) {

            this._isZooming = isZooming;
            $.publish("/PivotViewer/ImageController/Zoom", [this._isZooming]);

        }

        //Clear drawing area

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        //once properties set then draw

        for (var i = 0; i < tiles.length; i++) {

            var tile = tiles[i];
            var locations = tile._locations;

            //only draw if in visible area

            for (var l = 0; l < locations.length; l++) {

                var location = locations[l];
                var x1 = location.x + tile.width;
                var y1 = location.y + tile.height;
                var drawit =
                    ((0 <= location.x) &&
                        (location.x < context.canvas.width) &&
                        (0 <= location.y) &&
                        (location.y < context.canvas.height)) ||
                    ((0 <= location.x) &&
                        (location.x < context.canvas.width) &&
                        (0 <= y1) &&
                        (y1 < context.canvas.height)) ||
                    ((0 <= x1) &&
                        (x1 < context.canvas.width) &&
                        (0 <= location.y) &&
                        (location.y < context.canvas.height)) ||
                    ((0 <= x1) &&
                        (x1 < context.canvas.width) &&
                        (0 <= y1) &&
                        (y1 < context.canvas.height)) ||
                    ((0 <= location.x) &&
                        (location.x < context.canvas.width) &&
                        (location.y < context.canvas.height)) ||
                    ((0 <= location.y) &&
                        (location.y < context.canvas.height) &&
                        (location.x < context.canvas.width)) ||
                    ((location.x <= 0) &&
                        (0 <= x1) &&
                        (location.y <= 0) &&
                        (0 <= y1));

                if (drawit)
                    tile.draw(l);

            }

        }

        // request new frame
        if (!this._breaks)
            requestAnimFrame(function() {
                that.animateTiles();
            });
        else
            this._started = false;

    },

    beginAnimation: function() {

        if (!this._started && this._tiles.length > 0) {
            this._breaks = false;
            this.animateTiles();
        }

    },
    stopAnimation: function() {
        this._breaks = true;
    },
    setLinearEasingBoth: function() {
        this._easing = new Easing.Easer({
            type: "linear",
            side: "both"
        });
    },
    setCircularEasingBoth: function() {
        this._easing = new Easing.Easer({
            type: "circular",
            side: "both"
        });
    },
    setQuarticEasingOut: function() {
        this._easing = new Easing.Easer({
            type: "quartic",
            side: "out"
        });
    },
    getMaxTileRatio: function() {
        return this._imageController.MaxRatio;
    }
});

///
/// Tile
/// Used to contain the details of an individual tile, and to draw the tile on a given canvas context
///
PivotViewer.Views.Tile = Object.subClass({
    init: function(TileController) {
        if (!(this instanceof PivotViewer.Views.Tile)) {
            return new PivotViewer.Views.Tile(TileController);
        }
        this._imageLoaded = false;
        this._selected = false;
        this._images = null;
        this._locations = [];
        this._visible = true;
    },

    draw: function(loc) {

        var location = this._locations[loc];
        var ctrlr = TileController._imageController;
        var context = this.context;

        //Is the tile destination in visible area?

        if (this.destinationVisible)
            this._images = ctrlr.getImages(this.item.img,
                this.width,
                this.height);

        if (this._images != null) {

            //A DrawLevel function returned - invoke
            var completeImageHeight = ctrlr.getHeight(this.item.img);
            var completeImageWidth = ctrlr.getWidth(this.item.img);

            var displayHeight =
                this.height -
                Math.ceil(this.height < 128 ? this.height / 16 : 8);
            var displayWidth =
                this.width -
                Math.ceil(this.width < 128 ? this.width / 16 : 8);

            //Narrower images need to be centered

            var blankWidth = (this.width - 8) - displayWidth;
            var blankHeight = (this.height - 8) - displayHeight;

            // Handle displaying the deepzoom image tiles ( move to deepzoom.js )

            var xmargin = 0;
            var ymargin = 0;
            var scaled_width = displayWidth;
            var scaled_height = displayHeight;

            var tileSize = ctrlr._tileSize;

            //Get image level

            var image_level =
                Math.ceil(Math.log(this.width > this.height ?
                        this.width : this.height) /
                    Math.log(2));
            if (image_level == Infinity || image_level == -Infinity)
                image_level = 0;

            var maxlevel = ctrlr.getMaxLevel(this.item.img);
            if (image_level > maxlevel)
                image_level = maxlevel
            var level_factor =
                1 << (maxlevel - image_level);

            var levelHeight =
                Math.ceil(completeImageHeight / level_factor);
            var levelWidth =
                Math.ceil(completeImageWidth / level_factor);

            //Image will need to be scaled to get the displayHeight

            var scaleh = displayHeight / levelHeight;
            var scalew = displayWidth / levelWidth;

            var scale = (scaleh < scalew) ? scaleh : scalew;

            scaled_width = Math.ceil(levelWidth * scale);
            scaled_height = Math.ceil(levelHeight * scale);

            xmargin =
                Math.floor((displayWidth - scaled_width) / 2);
            ymargin =
                Math.floor((displayHeight - scaled_height) / 2);

            if (typeof this._images == "function")
                this._images(context,
                    location.x + xmargin,
                    location.y + ymargin,
                    scaled_width,
                    scaled_height);
            else if ((this._images.length > 0) &&
                this._images[0] instanceof Image) {

                //if the collection contains an image

                if (ctrlr instanceof PivotViewer.Views.DeepZoomImageController) {

                    var tileSize = ctrlr._tileSize;

                    //Get image level
                    lvl = this._images[0].src.match(/_files\/[0-9]+\//g)[0];

                    var imageLevel =
                        parseInt(lvl.substring(7, lvl.length - 1));

                    var level_factor =
                        1 << (ctrlr.getMaxLevel(this.item.img) -
                            imageLevel);

                    var levelHeight =
                        Math.ceil(completeImageHeight / level_factor);
                    var levelWidth =
                        Math.ceil(completeImageWidth / level_factor);

                    //Image will need to be scaled to get the displayHeight

                    var scaleh = displayHeight / levelHeight;
                    var scalew = displayWidth / levelWidth;

                    var scale = (scaleh < scalew) ? scaleh : scalew;

                    scaled_width = levelWidth * scale;
                    scaled_height = levelHeight * scale;

                    xmargin =
                        Math.floor((displayWidth - scaled_width) / 2);
                    ymargin =
                        Math.floor((displayHeight - scaled_height) / 2);

                    // handle overlap
                    overlap = ctrlr.getOverlap(this.item.img);

                    for (var i = 0; i < this._images.length; i++) {

                        // We need to know where individual image tiles go
                        var source = this._images[i].src;
                        var n = source.match(/[0-9]+_[0-9]+/g);
                        var nl = n[n.length - 1];

                        var xPosition =
                            parseInt(nl.substring(0, nl.indexOf("_")));
                        var yPosition =
                            parseInt(nl.substring(nl.indexOf("_") + 1));

                        var imageTileHeight =
                            Math.ceil(this._images[i].height * scale);
                        var imageTileWidth =
                            Math.ceil(this._images[i].width * scale);

                        var ofactor =
                            Math.floor((tileSize - overlap) * scale);
                        var offsetx =
                            xmargin + (xPosition * ofactor);
                        var offsety =
                            ymargin + (yPosition * ofactor);

                        context.drawImage(this._images[i],
                            offsetx + location.x,
                            offsety + location.y,
                            imageTileWidth,
                            imageTileHeight);
                    }
                } else {
                    var offsetx = (Math.floor(blankWidth / 2)) + 4;
                    var offsety = 4;
                    context.drawImage(this._images[0],
                        offsetx + location.x,
                        offsety + location.y,
                        displayWidth, displayHeight);
                }

                if (this._selected) {
                    //draw a blue border
                    context.beginPath();
                    var offsetx = xmargin;
                    var offsety = ymargin;
                    context.rect(offsetx +
                        this._locations[this.selectedLoc].x,
                        offsety +
                        this._locations[this.selectedLoc].y,
                        scaled_width, scaled_height);
                    context.lineWidth = 4;
                    context.strokeStyle = "#92C4E1";
                    context.stroke();

                }

            }

        } else
            this.drawEmpty(loc);

    },
    //http://simonsarris.com/blog/510-making-html5-canvas-useful
    contains: function(mx, my) {
        for (i = 0; i < this._locations.length; i++)
            if ((this._locations[i].x <= mx) &&
                (this._locations[i].x + this.width >= mx) &&
                (this._locations[i].y <= my) &&
                (this._locations[i].y + this.height >= my)){
                  return i;
                }

        return -1;

    },
    drawEmpty: function(loc) {

        var controller = TileController._imageController;
        var context = this.context;
        var location = this._locations[loc];

        if (controller.DrawLevel == undefined) {

            //draw an empty square

            context.beginPath();
            context.fillStyle = "#D7DDDD";
            context.fillRect(location.x + 4,
                location.y + 4,
                this.width - 8,
                this.height - 8);
            context.rect(location.x + 4,
                location.y + 4,
                this.width - 8,
                this.height - 8);
            context.lineWidth = 1;
            context.strokeStyle = "white";
            context.stroke();

        } else //use the controller's blank tile
            controller.DrawLevel(this.item,
            context,
            location.x + 4,
            location.y + 4,
            this.width - 8,
            this.height - 8);

    },
    now: null,
    end: null,
    width: 0,
    height: 0,
    origwidth: 0,
    origheight: 0,
    ratio: 1,
    startwidth: 0,
    startheight: 0,
    destinationwidth: 0,
    destinationheight: 0,
    destinationVisible: true,
    context: null,
    item: null,
    firstFilterItemDone: false,
    selectedLoc: 0,
    setSelected: function(selected, sLoc, cellLoc) {
      this._selected = selected;
      if(sLoc != null) this.selectedLoc = sLoc;
      if(cellLoc != null) this.cellLoc = cellLoc;
    }
});

///
/// Tile Location
///
/// Used to contain the location of a tile as in the graph view a tile
/// can appear multiple times
///

PivotViewer.Views.TileLocation = Object.subClass({
    init: function() {},
    x: 0,
    y: 0,
    startx: 0,
    starty: 0,
    destinationx: 0,
    destinationy: 0,
});
