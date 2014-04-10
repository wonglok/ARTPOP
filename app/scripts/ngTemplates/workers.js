angular.module('artpopApp').run(['$templateCache', function($templateCache) {  'use strict';

  $templateCache.put('workers/NeuQuant.js',
    "/*\n" +
    "* NeuQuant Neural-Net Quantization Algorithm\n" +
    "* ------------------------------------------\n" +
    "*\n" +
    "* Copyright (c) 1994 Anthony Dekker\n" +
    "*\n" +
    "* NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994. See\n" +
    "* \"Kohonen neural networks for optimal colour quantization\" in \"Network:\n" +
    "* Computation in Neural Systems\" Vol. 5 (1994) pp 351-367. for a discussion of\n" +
    "* the algorithm.\n" +
    "*\n" +
    "* Any party obtaining a copy of these files from the author, directly or\n" +
    "* indirectly, is granted, free of charge, a full and unrestricted irrevocable,\n" +
    "* world-wide, paid up, royalty-free, nonexclusive right and license to deal in\n" +
    "* this software and documentation files (the \"Software\"), including without\n" +
    "* limitation the rights to use, copy, modify, merge, publish, distribute,\n" +
    "* sublicense, and/or sell copies of the Software, and to permit persons who\n" +
    "* receive copies from any such party to do so, with the only requirement being\n" +
    "* that this copyright notice remain intact.\n" +
    "*/\n" +
    "\n" +
    "/*\n" +
    "* This class handles Neural-Net quantization algorithm\n" +
    "* @author Kevin Weiner (original Java version - kweiner@fmsware.com)\n" +
    "* @author Thibault Imbert (AS3 version - bytearray.org)\n" +
    "* @version 0.1 AS3 implementation\n" +
    "*/\n" +
    "\n" +
    "//import flash.utils.ByteArray;\n" +
    "\n" +
    "NeuQuant = function()\n" +
    "{\n" +
    "\tvar exports = {};\n" +
    "\t/*private_static*/ var netsize/*int*/ = 256; /* number of colours used */\n" +
    "\n" +
    "\t/* four primes near 500 - assume no image has a length so large */\n" +
    "\t/* that it is divisible by all four primes */\n" +
    "\n" +
    "\t/*private_static*/ var prime1/*int*/ = 499;\n" +
    "\t/*private_static*/ var prime2/*int*/ = 491;\n" +
    "\t/*private_static*/ var prime3/*int*/ = 487;\n" +
    "\t/*private_static*/ var prime4/*int*/ = 503;\n" +
    "\t/*private_static*/ var minpicturebytes/*int*/ = (3 * prime4);\n" +
    "\n" +
    "\t/* minimum size for input image */\n" +
    "\t/*\n" +
    "\t* Program Skeleton ---------------- [select samplefac in range 1..30] [read\n" +
    "\t* image from input file] pic = (unsigned char*) malloc(3*width*height);\n" +
    "\t* initnet(pic,3*width*height,samplefac); learn(); unbiasnet(); [write output\n" +
    "\t* image header, using writecolourmap(f)] inxbuild(); write output image using\n" +
    "\t* inxsearch(b,g,r)\n" +
    "\t*/\n" +
    "\n" +
    "\t/*\n" +
    "\t* Network Definitions -------------------\n" +
    "\t*/\n" +
    "\n" +
    "\t/*private_static*/ var maxnetpos/*int*/ = (netsize - 1);\n" +
    "\t/*private_static*/ var netbiasshift/*int*/ = 4; /* bias for colour values */\n" +
    "\t/*private_static*/ var ncycles/*int*/ = 100; /* no. of learning cycles */\n" +
    "\n" +
    "\t/* defs for freq and bias */\n" +
    "\t/*private_static*/ var intbiasshift/*int*/ = 16; /* bias for fractions */\n" +
    "\t/*private_static*/ var intbias/*int*/ = (1 << intbiasshift);\n" +
    "\t/*private_static*/ var gammashift/*int*/ = 10; /* gamma = 1024 */\n" +
    "\t/*private_static*/ var gamma/*int*/ = (1 << gammashift);\n" +
    "\t/*private_static*/ var betashift/*int*/ = 10;\n" +
    "\t/*private_static*/ var beta/*int*/ = (intbias >> betashift); /* beta = 1/1024 */\n" +
    "\t/*private_static*/ var betagamma/*int*/ = (intbias << (gammashift - betashift));\n" +
    "\n" +
    "\t/* defs for decreasing radius factor */\n" +
    "\t/*private_static*/ var initrad/*int*/ = (netsize >> 3); /*\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t * for 256 cols, radius\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t * starts\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t */\n" +
    "\n" +
    "\t/*private_static*/ var radiusbiasshift/*int*/ = 6; /* at 32.0 biased by 6 bits */\n" +
    "\t/*private_static*/ var radiusbias/*int*/ = (1 << radiusbiasshift);\n" +
    "\t/*private_static*/ var initradius/*int*/ = (initrad * radiusbias); /*\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t   * and\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t   * decreases\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t   * by a\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t   */\n" +
    "\n" +
    "\t/*private_static*/ var radiusdec/*int*/ = 30; /* factor of 1/30 each cycle */\n" +
    "\n" +
    "\t/* defs for decreasing alpha factor */\n" +
    "\t/*private_static*/ var alphabiasshift/*int*/ = 10; /* alpha starts at 1.0 */\n" +
    "\t/*private_static*/ var initalpha/*int*/ = (1 << alphabiasshift);\n" +
    "\t/*private*/ var alphadec/*int*/ /* biased by 10 bits */\n" +
    "\n" +
    "\t/* radbias and alpharadbias used for radpower calculation */\n" +
    "\t/*private_static*/ var radbiasshift/*int*/ = 8;\n" +
    "\t/*private_static*/ var radbias/*int*/ = (1 << radbiasshift);\n" +
    "\t/*private_static*/ var alpharadbshift/*int*/ = (alphabiasshift + radbiasshift);\n" +
    "\n" +
    "\t/*private_static*/ var alpharadbias/*int*/ = (1 << alpharadbshift);\n" +
    "\n" +
    "\t/*\n" +
    "\t* Types and Global Variables --------------------------\n" +
    "\t*/\n" +
    "\n" +
    "\t/*private*/ var thepicture/*ByteArray*//* the input image itself */\n" +
    "\t/*private*/ var lengthcount/*int*/; /* lengthcount = H*W*3 */\n" +
    "\t/*private*/ var samplefac/*int*/; /* sampling factor 1..30 */\n" +
    "\n" +
    "\t// typedef int pixel[4]; /* BGRc */\n" +
    "\t/*private*/ var network/*Array*/; /* the network itself - [netsize][4] */\n" +
    "\t/*protected*/ var netindex/*Array*/ = new Array();\n" +
    "\n" +
    "\t/* for network lookup - really 256 */\n" +
    "\t/*private*/ var bias/*Array*/ = new Array();\n" +
    "\n" +
    "\t/* bias and freq arrays for learning */\n" +
    "\t/*private*/ var freq/*Array*/ = new Array();\n" +
    "\t/*private*/ var radpower/*Array*/ = new Array();\n" +
    "\n" +
    "\tvar NeuQuant = exports.NeuQuant = function NeuQuant(thepic/*ByteArray*/, len/*int*/, sample/*int*/)\n" +
    "\t{\n" +
    "\n" +
    "\t\tvar i/*int*/;\n" +
    "\t\tvar p/*Array*/;\n" +
    "\n" +
    "\t\tthepicture = thepic;\n" +
    "\t\tlengthcount = len;\n" +
    "\t\tsamplefac = sample;\n" +
    "\n" +
    "\t\tnetwork = new Array(netsize);\n" +
    "\n" +
    "\t\tfor (i = 0; i < netsize; i++)\n" +
    "\t\t{\n" +
    "\n" +
    "\t\t\tnetwork[i] = new Array(4);\n" +
    "\t\t\tp = network[i];\n" +
    "\t\t\tp[0] = p[1] = p[2] = (i << (netbiasshift + 8)) / netsize;\n" +
    "\t\t\tfreq[i] = intbias / netsize; /* 1/netsize */\n" +
    "\t\t\tbias[i] = 0;\n" +
    "\t\t}\n" +
    "\n" +
    "\t}\n" +
    "\n" +
    "\tvar colorMap = function colorMap()/*ByteArray*/\n" +
    "\t{\n" +
    "\n" +
    "\t\tvar map/*ByteArray*/ = [];\n" +
    "\t\tvar index/*Array*/ = new Array(netsize);\n" +
    "\t\tfor (var i/*int*/ = 0; i < netsize; i++)\n" +
    "\t\t  index[network[i][3]] = i;\n" +
    "\t\tvar k/*int*/ = 0;\n" +
    "\t\tfor (var l/*int*/ = 0; l < netsize; l++) {\n" +
    "\t\t  var j/*int*/ = index[l];\n" +
    "\t\t  map[k++] = (network[j][0]);\n" +
    "\t\t  map[k++] = (network[j][1]);\n" +
    "\t\t  map[k++] = (network[j][2]);\n" +
    "\t\t}\n" +
    "\t\treturn map;\n" +
    "\n" +
    "\t}\n" +
    "\n" +
    "\t/*\n" +
    "   * Insertion sort of network and building of netindex[0..255] (to do after\n" +
    "   * unbias)\n" +
    "   * -------------------------------------------------------------------------------\n" +
    "   */\n" +
    "\n" +
    "   var inxbuild = function inxbuild()/*void*/\n" +
    "   {\n" +
    "\n" +
    "\t  var i/*int*/;\n" +
    "\t  var j/*int*/;\n" +
    "\t  var smallpos/*int*/;\n" +
    "\t  var smallval/*int*/;\n" +
    "\t  var p/*Array*/;\n" +
    "\t  var q/*Array*/;\n" +
    "\t  var previouscol/*int*/\n" +
    "\t  var startpos/*int*/\n" +
    "\n" +
    "\t  previouscol = 0;\n" +
    "\t  startpos = 0;\n" +
    "\t  for (i = 0; i < netsize; i++)\n" +
    "\t  {\n" +
    "\n" +
    "\t\t  p = network[i];\n" +
    "\t\t  smallpos = i;\n" +
    "\t\t  smallval = p[1]; /* index on g */\n" +
    "\t\t  /* find smallest in i..netsize-1 */\n" +
    "\t\t  for (j = i + 1; j < netsize; j++)\n" +
    "\t\t  {\n" +
    "\t\t\t  q = network[j];\n" +
    "\t\t\t  if (q[1] < smallval)\n" +
    "\t\t\t  { /* index on g */\n" +
    "\n" +
    "\t\t\t\tsmallpos = j;\n" +
    "\t\t\t\tsmallval = q[1]; /* index on g */\n" +
    "\t\t\t}\n" +
    "\t\t  }\n" +
    "\n" +
    "\t\t  q = network[smallpos];\n" +
    "\t\t  /* swap p (i) and q (smallpos) entries */\n" +
    "\n" +
    "\t\t  if (i != smallpos)\n" +
    "\t\t  {\n" +
    "\n" +
    "\t\t\t  j = q[0];\n" +
    "\t\t\t  q[0] = p[0];\n" +
    "\t\t\t  p[0] = j;\n" +
    "\t\t\t  j = q[1];\n" +
    "\t\t\t  q[1] = p[1];\n" +
    "\t\t\t  p[1] = j;\n" +
    "\t\t\t  j = q[2];\n" +
    "\t\t\t  q[2] = p[2];\n" +
    "\t\t\t  p[2] = j;\n" +
    "\t\t\t  j = q[3];\n" +
    "\t\t\t  q[3] = p[3];\n" +
    "\t\t\t  p[3] = j;\n" +
    "\n" +
    "\t\t  }\n" +
    "\n" +
    "\t\t  /* smallval entry is now in position i */\n" +
    "\n" +
    "\t\t  if (smallval != previouscol)\n" +
    "\n" +
    "\t\t  {\n" +
    "\n" +
    "\t\t\tnetindex[previouscol] = (startpos + i) >> 1;\n" +
    "\n" +
    "\t\t\tfor (j = previouscol + 1; j < smallval; j++) netindex[j] = i;\n" +
    "\n" +
    "\t\t\tpreviouscol = smallval;\n" +
    "\t\t\tstartpos = i;\n" +
    "\n" +
    "\t\t  }\n" +
    "\n" +
    "\t\t}\n" +
    "\n" +
    "\t\tnetindex[previouscol] = (startpos + maxnetpos) >> 1;\n" +
    "\t\tfor (j = previouscol + 1; j < 256; j++) netindex[j] = maxnetpos; /* really 256 */\n" +
    "\n" +
    "   }\n" +
    "\n" +
    "   /*\n" +
    "   * Main Learning Loop ------------------\n" +
    "   */\n" +
    "\n" +
    "   var learn = function learn()/*void*/\n" +
    "\n" +
    "   {\n" +
    "\n" +
    "\t   var i/*int*/;\n" +
    "\t   var j/*int*/;\n" +
    "\t   var b/*int*/;\n" +
    "\t   var g/*int*/\n" +
    "\t   var r/*int*/;\n" +
    "\t   var radius/*int*/;\n" +
    "\t   var rad/*int*/;\n" +
    "\t   var alpha/*int*/;\n" +
    "\t   var step/*int*/;\n" +
    "\t   var delta/*int*/;\n" +
    "\t   var samplepixels/*int*/;\n" +
    "\t   var p/*ByteArray*/;\n" +
    "\t   var pix/*int*/;\n" +
    "\t   var lim/*int*/;\n" +
    "\n" +
    "\t   if (lengthcount < minpicturebytes) samplefac = 1;\n" +
    "\n" +
    "\t   alphadec = 30 + ((samplefac - 1) / 3);\n" +
    "\t   p = thepicture;\n" +
    "\t   pix = 0;\n" +
    "\t   lim = lengthcount;\n" +
    "\t   samplepixels = lengthcount / (3 * samplefac);\n" +
    "\t   delta = (samplepixels / ncycles) | 0;\n" +
    "\t   alpha = initalpha;\n" +
    "\t   radius = initradius;\n" +
    "\n" +
    "\t   rad = radius >> radiusbiasshift;\n" +
    "\t   if (rad <= 1) rad = 0;\n" +
    "\n" +
    "\t   for (i = 0; i < rad; i++) radpower[i] = alpha * (((rad * rad - i * i) * radbias) / (rad * rad));\n" +
    "\n" +
    "\n" +
    "\t   if (lengthcount < minpicturebytes) step = 3;\n" +
    "\n" +
    "\t   else if ((lengthcount % prime1) != 0) step = 3 * prime1;\n" +
    "\n" +
    "\t   else\n" +
    "\n" +
    "\t   {\n" +
    "\n" +
    "\t\t   if ((lengthcount % prime2) != 0) step = 3 * prime2;\n" +
    "\n" +
    "\t\t   else\n" +
    "\n" +
    "\t\t   {\n" +
    "\n" +
    "\t\t\t   if ((lengthcount % prime3) != 0) step = 3 * prime3;\n" +
    "\n" +
    "\t\t\t   else step = 3 * prime4;\n" +
    "\n" +
    "\t\t   }\n" +
    "\n" +
    "\t   }\n" +
    "\n" +
    "\t   i = 0;\n" +
    "\n" +
    "\t   while (i < samplepixels)\n" +
    "\n" +
    "\t   {\n" +
    "\n" +
    "\t\t   b = (p[pix + 0] & 0xff) << netbiasshift;\n" +
    "\t\t   g = (p[pix + 1] & 0xff) << netbiasshift;\n" +
    "\t\t   r = (p[pix + 2] & 0xff) << netbiasshift;\n" +
    "\t\t   j = contest(b, g, r);\n" +
    "\n" +
    "\t\t   altersingle(alpha, j, b, g, r);\n" +
    "\n" +
    "\t\t   if (rad != 0) alterneigh(rad, j, b, g, r); /* alter neighbours */\n" +
    "\n" +
    "\t\t   pix += step;\n" +
    "\n" +
    "\t\t   if (pix >= lim) pix -= lengthcount;\n" +
    "\n" +
    "\t\t   i++;\n" +
    "\n" +
    "\t\t   if (delta == 0) delta = 1;\n" +
    "\n" +
    "\t\t   if (i % delta == 0)\n" +
    "\n" +
    "\t\t   {\n" +
    "\n" +
    "\t\t\t   alpha -= alpha / alphadec;\n" +
    "\t\t\t   radius -= radius / radiusdec;\n" +
    "\t\t\t   rad = radius >> radiusbiasshift;\n" +
    "\n" +
    "\t\t\t   if (rad <= 1) rad = 0;\n" +
    "\n" +
    "\t\t\t   for (j = 0; j < rad; j++) radpower[j] = alpha * (((rad * rad - j * j) * radbias) / (rad * rad));\n" +
    "\n" +
    "\t\t   }\n" +
    "\n" +
    "\t   }\n" +
    "\n" +
    "   }\n" +
    "\n" +
    "   /*\n" +
    "   ** Search for BGR values 0..255 (after net is unbiased) and return colour\n" +
    "   * index\n" +
    "   * ----------------------------------------------------------------------------\n" +
    "   */\n" +
    "\n" +
    "   var map = exports.map = function map(b/*int*/, g/*int*/, r/*int*/)/*int*/\n" +
    "\n" +
    "   {\n" +
    "\n" +
    "\t   var i/*int*/;\n" +
    "\t   var j/*int*/;\n" +
    "\t   var dist/*int*/\n" +
    "\t   var a/*int*/;\n" +
    "\t   var bestd/*int*/;\n" +
    "\t   var p/*Array*/;\n" +
    "\t   var best/*int*/;\n" +
    "\n" +
    "\t   bestd = 1000; /* biggest possible dist is 256*3 */\n" +
    "\t   best = -1;\n" +
    "\t   i = netindex[g]; /* index on g */\n" +
    "\t   j = i - 1; /* start at netindex[g] and work outwards */\n" +
    "\n" +
    "\twhile ((i < netsize) || (j >= 0))\n" +
    "\n" +
    "\t{\n" +
    "\n" +
    "\t\tif (i < netsize)\n" +
    "\n" +
    "\t\t{\n" +
    "\n" +
    "\t\t\tp = network[i];\n" +
    "\n" +
    "\t\t\tdist = p[1] - g; /* inx key */\n" +
    "\n" +
    "\t\t\tif (dist >= bestd) i = netsize; /* stop iter */\n" +
    "\n" +
    "\t\t\telse\n" +
    "\n" +
    "\t\t\t{\n" +
    "\n" +
    "\t\t\t\ti++;\n" +
    "\n" +
    "\t\t\t\tif (dist < 0) dist = -dist;\n" +
    "\n" +
    "\t\t\t\ta = p[0] - b;\n" +
    "\n" +
    "\t\t\t\tif (a < 0) a = -a;\n" +
    "\n" +
    "\t\t\t\tdist += a;\n" +
    "\n" +
    "\t\t\t\tif (dist < bestd)\n" +
    "\n" +
    "\t\t\t\t{\n" +
    "\n" +
    "\t\t\t\t\ta = p[2] - r;\n" +
    "\n" +
    "\t\t\t\t\tif (a < 0) a = -a;\n" +
    "\n" +
    "\t\t\t\t\tdist += a;\n" +
    "\n" +
    "\t\t\t\t\tif (dist < bestd)\n" +
    "\n" +
    "\t\t\t\t\t{\n" +
    "\n" +
    "\t\t\t\t\t\tbestd = dist;\n" +
    "\t\t\t\t\t\tbest = p[3];\n" +
    "\n" +
    "\t\t\t\t\t}\n" +
    "\n" +
    "\t\t\t\t}\n" +
    "\n" +
    "\t\t\t}\n" +
    "\n" +
    "\t\t}\n" +
    "\n" +
    "\t  if (j >= 0)\n" +
    "\t  {\n" +
    "\n" +
    "\t\t  p = network[j];\n" +
    "\n" +
    "\t\t  dist = g - p[1]; /* inx key - reverse dif */\n" +
    "\n" +
    "\t\t  if (dist >= bestd) j = -1; /* stop iter */\n" +
    "\n" +
    "\t\t  else\n" +
    "\t\t  {\n" +
    "\n" +
    "\t\t\t  j--;\n" +
    "\t\t\t  if (dist < 0) dist = -dist;\n" +
    "\t\t\t  a = p[0] - b;\n" +
    "\t\t\t  if (a < 0) a = -a;\n" +
    "\t\t\t  dist += a;\n" +
    "\n" +
    "\t\t\t  if (dist < bestd)\n" +
    "\n" +
    "\t\t\t  {\n" +
    "\n" +
    "\t\t\t\t  a = p[2] - r;\n" +
    "\t\t\t\t  if (a < 0)a = -a;\n" +
    "\t\t\t\t  dist += a;\n" +
    "\t\t\t\t  if (dist < bestd)\n" +
    "\t\t\t\t  {\n" +
    "\t\t\t\t\t  bestd = dist;\n" +
    "\t\t\t\t\t  best = p[3];\n" +
    "\t\t\t\t  }\n" +
    "\n" +
    "\t\t\t  }\n" +
    "\n" +
    "\t\t  }\n" +
    "\n" +
    "\t  }\n" +
    "\n" +
    "\t}\n" +
    "\n" +
    "\treturn (best);\n" +
    "\n" +
    "  }\n" +
    "\n" +
    "  var process = exports.process = function process()/*ByteArray*/\n" +
    "  {\n" +
    "\n" +
    "\tlearn();\n" +
    "\tunbiasnet();\n" +
    "\tinxbuild();\n" +
    "\treturn colorMap();\n" +
    "\n" +
    "  }\n" +
    "\n" +
    "  /*\n" +
    "  * Unbias network to give byte values 0..255 and record position i to prepare\n" +
    "  * for sort\n" +
    "  * -----------------------------------------------------------------------------------\n" +
    "  */\n" +
    "\n" +
    "  var unbiasnet = function unbiasnet()/*void*/\n" +
    "\n" +
    "  {\n" +
    "\n" +
    "\tvar i/*int*/;\n" +
    "\tvar j/*int*/;\n" +
    "\n" +
    "\tfor (i = 0; i < netsize; i++)\n" +
    "\t{\n" +
    "\t  network[i][0] >>= netbiasshift;\n" +
    "\t  network[i][1] >>= netbiasshift;\n" +
    "\t  network[i][2] >>= netbiasshift;\n" +
    "\t  network[i][3] = i; /* record colour no */\n" +
    "\t}\n" +
    "\n" +
    "  }\n" +
    "\n" +
    "  /*\n" +
    "  * Move adjacent neurons by precomputed alpha*(1-((i-j)^2/[r]^2)) in\n" +
    "  * radpower[|i-j|]\n" +
    "  * ---------------------------------------------------------------------------------\n" +
    "  */\n" +
    "\n" +
    "  var alterneigh = function alterneigh(rad/*int*/, i/*int*/, b/*int*/, g/*int*/, r/*int*/)/*void*/\n" +
    "\n" +
    "  {\n" +
    "\n" +
    "\t  var j/*int*/;\n" +
    "\t  var k/*int*/;\n" +
    "\t  var lo/*int*/;\n" +
    "\t  var hi/*int*/;\n" +
    "\t  var a/*int*/;\n" +
    "\t  var m/*int*/;\n" +
    "\n" +
    "\t  var p/*Array*/;\n" +
    "\n" +
    "\t  lo = i - rad;\n" +
    "\t  if (lo < -1) lo = -1;\n" +
    "\n" +
    "\t  hi = i + rad;\n" +
    "\n" +
    "\t  if (hi > netsize) hi = netsize;\n" +
    "\n" +
    "\t  j = i + 1;\n" +
    "\t  k = i - 1;\n" +
    "\t  m = 1;\n" +
    "\n" +
    "\t  while ((j < hi) || (k > lo))\n" +
    "\n" +
    "\t  {\n" +
    "\n" +
    "\t\t  a = radpower[m++];\n" +
    "\n" +
    "\t\t  if (j < hi)\n" +
    "\n" +
    "\t\t  {\n" +
    "\n" +
    "\t\t\t  p = network[j++];\n" +
    "\n" +
    "\t\t\t  try {\n" +
    "\n" +
    "\t\t\t\t  p[0] -= (a * (p[0] - b)) / alpharadbias;\n" +
    "\t\t\t\t  p[1] -= (a * (p[1] - g)) / alpharadbias;\n" +
    "\t\t\t\t  p[2] -= (a * (p[2] - r)) / alpharadbias;\n" +
    "\n" +
    "\t\t\t\t  } catch (e/*Error*/) {} // prevents 1.3 miscompilation\n" +
    "\n" +
    "\t\t\t}\n" +
    "\n" +
    "\t\t\tif (k > lo)\n" +
    "\n" +
    "\t\t\t{\n" +
    "\n" +
    "\t\t\t\tp = network[k--];\n" +
    "\n" +
    "\t\t\t\ttry\n" +
    "\t\t\t\t{\n" +
    "\n" +
    "\t\t\t\t\tp[0] -= (a * (p[0] - b)) / alpharadbias;\n" +
    "\t\t\t\t\tp[1] -= (a * (p[1] - g)) / alpharadbias;\n" +
    "\t\t\t\t\tp[2] -= (a * (p[2] - r)) / alpharadbias;\n" +
    "\n" +
    "\t\t\t\t} catch (e/*Error*/) {}\n" +
    "\n" +
    "\t\t\t}\n" +
    "\n" +
    "\t  }\n" +
    "\n" +
    "  }\n" +
    "\n" +
    "  /*\n" +
    "  * Move neuron i towards biased (b,g,r) by factor alpha\n" +
    "  * ----------------------------------------------------\n" +
    "  */\n" +
    "\n" +
    "  var altersingle = function altersingle(alpha/*int*/, i/*int*/, b/*int*/, g/*int*/, r/*int*/)/*void*/\n" +
    "  {\n" +
    "\n" +
    "\t  /* alter hit neuron */\n" +
    "\t  var n/*Array*/ = network[i];\n" +
    "\t  n[0] -= (alpha * (n[0] - b)) / initalpha;\n" +
    "\t  n[1] -= (alpha * (n[1] - g)) / initalpha;\n" +
    "\t  n[2] -= (alpha * (n[2] - r)) / initalpha;\n" +
    "\n" +
    "  }\n" +
    "\n" +
    "  /*\n" +
    "  * Search for biased BGR values ----------------------------\n" +
    "  */\n" +
    "\n" +
    "  var contest = function contest(b/*int*/, g/*int*/, r/*int*/)/*int*/\n" +
    "  {\n" +
    "\n" +
    "\t  /* finds closest neuron (min dist) and updates freq */\n" +
    "\t  /* finds best neuron (min dist-bias) and returns position */\n" +
    "\t  /* for frequently chosen neurons, freq[i] is high and bias[i] is negative */\n" +
    "\t  /* bias[i] = gamma*((1/netsize)-freq[i]) */\n" +
    "\n" +
    "\t  var i/*int*/;\n" +
    "\t  var dist/*int*/;\n" +
    "\t  var a/*int*/;\n" +
    "\t  var biasdist/*int*/;\n" +
    "\t  var betafreq/*int*/;\n" +
    "\t  var bestpos/*int*/;\n" +
    "\t  var bestbiaspos/*int*/;\n" +
    "\t  var bestd/*int*/;\n" +
    "\t  var bestbiasd/*int*/;\n" +
    "\t  var n/*Array*/;\n" +
    "\n" +
    "\t  bestd = ~(1 << 31);\n" +
    "\t  bestbiasd = bestd;\n" +
    "\t  bestpos = -1;\n" +
    "\t  bestbiaspos = bestpos;\n" +
    "\n" +
    "\t  for (i = 0; i < netsize; i++)\n" +
    "\n" +
    "\t  {\n" +
    "\n" +
    "\t\t  n = network[i];\n" +
    "\t\t  dist = n[0] - b;\n" +
    "\n" +
    "\t\t  if (dist < 0) dist = -dist;\n" +
    "\n" +
    "\t\t  a = n[1] - g;\n" +
    "\n" +
    "\t\t  if (a < 0) a = -a;\n" +
    "\n" +
    "\t\t  dist += a;\n" +
    "\n" +
    "\t\t  a = n[2] - r;\n" +
    "\n" +
    "\t\t  if (a < 0) a = -a;\n" +
    "\n" +
    "\t\t  dist += a;\n" +
    "\n" +
    "\t\t  if (dist < bestd)\n" +
    "\n" +
    "\t\t  {\n" +
    "\n" +
    "\t\t\t  bestd = dist;\n" +
    "\t\t\t  bestpos = i;\n" +
    "\n" +
    "\t\t  }\n" +
    "\n" +
    "\t\t  biasdist = dist - ((bias[i]) >> (intbiasshift - netbiasshift));\n" +
    "\n" +
    "\t\t  if (biasdist < bestbiasd)\n" +
    "\n" +
    "\t\t  {\n" +
    "\n" +
    "\t\t\t  bestbiasd = biasdist;\n" +
    "\t\t\t  bestbiaspos = i;\n" +
    "\n" +
    "\t\t  }\n" +
    "\n" +
    "\t\t  betafreq = (freq[i] >> betashift);\n" +
    "\t\t  freq[i] -= betafreq;\n" +
    "\t\t  bias[i] += (betafreq << gammashift);\n" +
    "\n" +
    "\t  }\n" +
    "\n" +
    "\t  freq[bestpos] += beta;\n" +
    "\t  bias[bestpos] -= betagamma;\n" +
    "\t  return (bestbiaspos);\n" +
    "\n" +
    "  }\n" +
    "\n" +
    "  NeuQuant.apply(this, arguments);\n" +
    "  return exports;\n" +
    "}\n"
  );


  $templateCache.put('workers/omggif-worker.js',
    "/*\n" +
    "  Gluing OMGGIF and NeuQuant.js in a worker, by Forrest Oliphant for meemoo.org\n" +
    "\n" +
    "  Message to worker should be an object with\n" +
    "  {\n" +
    "    frames: (array of pixel data objects),\n" +
    "    delay: (ms delay per frame),\n" +
    "    matte: ([r,g,b] (default white)),\n" +
    "    transparent: ([r,g,b] (optional))\n" +
    "  }\n" +
    "\n" +
    "  Messages from worker will either be\n" +
    "  {\n" +
    "    type: \"progress\",\n" +
    "    data: (percent done, 0.0-1.0)\n" +
    "  }\n" +
    "  or\n" +
    "  {\n" +
    "    type: \"gif\",\n" +
    "    data: (binary gif data),\n" +
    "    frameCount: (number of frames),\n" +
    "    encodeTime: (ms how long it took to encode)\n" +
    "  }\n" +
    "\n" +
    "*/\n" +
    "\n" +
    "if (typeof importScripts === 'function'){\n" +
    "  self.importScripts('omggif.js', 'NeuQuant.js');\n" +
    "}\n" +
    "\n" +
    "var thereAreTransparentPixels = false;\n" +
    "\n" +
    "var rgba2rgb = function (data, matte, transparent) {\n" +
    "  var pixels = [];\n" +
    "  var count = 0;\n" +
    "  var len = data.length;\n" +
    "  for ( var i=0; i<len; i+=4 ) {\n" +
    "    var r = data[i];\n" +
    "    var g = data[i+1];\n" +
    "    var b = data[i+2];\n" +
    "    var a = data[i+3];\n" +
    "    if (transparent && a===0) {\n" +
    "      // Use transparent color\n" +
    "      r = transparent[0];\n" +
    "      g = transparent[1];\n" +
    "      b = transparent[2];\n" +
    "      thereAreTransparentPixels = true;\n" +
    "    } else if (matte && a<255) {\n" +
    "      // Use matte with \"over\" blend mode\n" +
    "      r = ( (r*a + (matte[0] * (255-a))) / 255 ) |0;\n" +
    "      g = ( (g*a + (matte[1] * (255-a))) / 255 ) |0;\n" +
    "      b = ( (b*a + (matte[2] * (255-a))) / 255 ) |0;\n" +
    "    }\n" +
    "    pixels[count++] = r;\n" +
    "    pixels[count++] = g;\n" +
    "    pixels[count++] = b;\n" +
    "  }\n" +
    "  return pixels;\n" +
    "};\n" +
    "\n" +
    "var rgb2num = function(palette) {\n" +
    "  var colors = [];\n" +
    "  var count = 0;\n" +
    "  var len = palette.length;\n" +
    "  for ( var i=0; i<len; i+=3 ) {\n" +
    "    colors[count++] = palette[i+2] | (palette[i+1] << 8) | (palette[i] << 16);\n" +
    "  }\n" +
    "  return colors;\n" +
    "};\n" +
    "\n" +
    "self.onmessage = function(event) {\n" +
    "  var frames = event.data.frames;\n" +
    "  var framesLength = frames.length;\n" +
    "  var delay = event.data.delay / 10;\n" +
    "\n" +
    "  var matte = event.data.matte ? event.data.matte : [255,255,255];\n" +
    "  var transparent = event.data.transparent ? event.data.transparent : false;\n" +
    "\n" +
    "  var startTime = Date.now();\n" +
    "\n" +
    "  //new ArrayBuffer(data.length)\n" +
    "  var buffer = new Uint8Array( frames[0].width * frames[0].height * framesLength * 5 );\n" +
    "  //var buffer = new Uint8Array( frames[0].width * frames[0].height * framesLength * 5 );\n" +
    "  var gif = new GifWriter( buffer, frames[0].width, frames[0].height, { loop: 0 } );\n" +
    "  // var pixels = new Uint8Array( frames[0].width * frames[0].height );\n" +
    "\n" +
    "  var addFrame = function (frame) {\n" +
    "    var data = frame.data;\n" +
    "\n" +
    "    // Make palette with NeuQuant.js\n" +
    "    var nqInPixels = rgba2rgb(data, matte, transparent);\n" +
    "    var len = nqInPixels.length;\n" +
    "    var nPix = len / 3;\n" +
    "    var map = [];\n" +
    "    var nq = new NeuQuant(nqInPixels, len, 10);\n" +
    "    // initialize quantizer\n" +
    "    var paletteRGB = nq.process(); // create reduced palette\n" +
    "    var palette = rgb2num(paletteRGB);\n" +
    "    // map image pixels to new palette\n" +
    "    var k = 0;\n" +
    "    for (var j = 0; j < nPix; j++) {\n" +
    "      var index = nq.map(nqInPixels[k++] & 0xff, nqInPixels[k++] & 0xff, nqInPixels[k++] & 0xff);\n" +
    "      // usedEntry[index] = true;\n" +
    "      map[j] = index;\n" +
    "    }\n" +
    "\n" +
    "    var options = { palette: new Uint32Array( palette ), delay: delay };\n" +
    "\n" +
    "    if (thereAreTransparentPixels) {\n" +
    "      options.transparent = nq.map(transparent[0], transparent[1], transparent[2]);\n" +
    "      options.disposal = 2; // Clear between frames\n" +
    "    }\n" +
    "\n" +
    "    gif.addFrame( 0, 0, frame.width, frame.height, new Uint8Array( map ), options );\n" +
    "  };\n" +
    "\n" +
    "  var i;\n" +
    "  // Add all frames\n" +
    "  for (i = 0; i<framesLength; i++) {\n" +
    "    addFrame( frames[i] );\n" +
    "    self.postMessage({\n" +
    "      type: \"progress\",\n" +
    "      data: (i+1)/framesLength\n" +
    "    });\n" +
    "  }\n" +
    "\n" +
    "  //\n" +
    "  var getGif = function() {\n" +
    "    var l = gif.end();\n" +
    "    var uInt8View = new Uint8Array(new ArrayBuffer( l+1 ));\n" +
    "    //var viewLength = uInt8View.length;\n" +
    "    var i;\n" +
    "    for (i = 0; i < l; i++) {\n" +
    "      uInt8View[i] = buffer[i];\n" +
    "    }\n" +
    "    return uInt8View;\n" +
    "  };\n" +
    "\n" +
    "  var transferableBuffer = getGif();\n" +
    "\n" +
    "\n" +
    "  // Finish\n" +
    "  var gifString = '';\n" +
    "  var l = gif.end();\n" +
    "  for (i = 0; i < l; i++) {\n" +
    "    gifString += String.fromCharCode( buffer[ i ] );\n" +
    "  }\n" +
    "\n" +
    "  self.postMessage({\n" +
    "    type: \"gif\",\n" +
    "    buffer: transferableBuffer,\n" +
    "    data: gifString,\n" +
    "    frameCount: framesLength,\n" +
    "    encodeTime: Date.now()-startTime\n" +
    "  });\n" +
    "\n" +
    "  // Terminate self\n" +
    "  self.close();\n" +
    "};"
  );


  $templateCache.put('workers/omggif.js',
    "// (c) Dean McNamee <dean@gmail.com>, 2013.\n" +
    "//\n" +
    "// https://github.com/deanm/omggif\n" +
    "//\n" +
    "// Permission is hereby granted, free of charge, to any person obtaining a copy\n" +
    "// of this software and associated documentation files (the \"Software\"), to\n" +
    "// deal in the Software without restriction, including without limitation the\n" +
    "// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or\n" +
    "// sell copies of the Software, and to permit persons to whom the Software is\n" +
    "// furnished to do so, subject to the following conditions:\n" +
    "//\n" +
    "// The above copyright notice and this permission notice shall be included in\n" +
    "// all copies or substantial portions of the Software.\n" +
    "//\n" +
    "// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n" +
    "// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n" +
    "// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n" +
    "// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n" +
    "// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\n" +
    "// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS\n" +
    "// IN THE SOFTWARE.\n" +
    "//\n" +
    "// omggif is a JavaScript implementation of a GIF 89a encoder, including\n" +
    "// animation and compression.  It does not rely on any specific underlying\n" +
    "// system, so should run in the browser, Node, or Plask.\n" +
    "\n" +
    "function GifWriter(buf, width, height, gopts) {\n" +
    "  var p = 0;\n" +
    "\n" +
    "  var gopts = gopts === undefined ? { } : gopts;\n" +
    "  var loop_count = gopts.loop === undefined ? null : gopts.loop;\n" +
    "  var global_palette = gopts.palette === undefined ? null : gopts.palette;\n" +
    "\n" +
    "  if (width <= 0 || height <= 0 || width > 65535 || height > 65535)\n" +
    "    throw \"Width/Height invalid.\"\n" +
    "\n" +
    "  function check_palette_and_num_colors(palette) {\n" +
    "    var num_colors = palette.length;\n" +
    "    if (num_colors < 2 || num_colors > 256 ||  num_colors & (num_colors-1))\n" +
    "      throw \"Invalid code/color length (\"+num_colors+\"), must be power of 2 and 2 .. 256.\";\n" +
    "    return num_colors;\n" +
    "  }\n" +
    "\n" +
    "  // - Header.\n" +
    "  buf[p++] = 0x47; buf[p++] = 0x49; buf[p++] = 0x46;  // GIF\n" +
    "  buf[p++] = 0x38; buf[p++] = 0x39; buf[p++] = 0x61;  // 89a\n" +
    "\n" +
    "  // Handling of Global Color Table (palette) and background index.\n" +
    "  var gp_num_colors_pow2 = 0;\n" +
    "  var background = 0;\n" +
    "  if (global_palette !== null) {\n" +
    "    var gp_num_colors = check_palette_and_num_colors(global_palette);\n" +
    "    while (gp_num_colors >>= 1) ++gp_num_colors_pow2;\n" +
    "    gp_num_colors = 1 << gp_num_colors_pow2;\n" +
    "    --gp_num_colors_pow2;\n" +
    "    if (gopts.background !== undefined) {\n" +
    "      background = gopts.background;\n" +
    "      if (background >= gp_num_colors) throw \"Background index out of range.\";\n" +
    "      // The GIF spec states that a background index of 0 should be ignored, so\n" +
    "      // this is probably a mistake and you really want to set it to another\n" +
    "      // slot in the palette.  But actually in the end most browsers, etc end\n" +
    "      // up ignoring this almost completely (including for dispose background).\n" +
    "      if (background === 0)\n" +
    "        throw \"Background index explicitly passed as 0.\";\n" +
    "    }\n" +
    "  }\n" +
    "\n" +
    "  // - Logical Screen Descriptor.\n" +
    "  // NOTE(deanm): w/h apparently ignored by implementations, but set anyway.\n" +
    "  buf[p++] = width & 0xff; buf[p++] = width >> 8 & 0xff;\n" +
    "  buf[p++] = height & 0xff; buf[p++] = height >> 8 & 0xff;\n" +
    "  // NOTE: Indicates 0-bpp original color resolution (unused?).\n" +
    "  buf[p++] = (global_palette !== null ? 0x80 : 0) |  // Global Color Table Flag.\n" +
    "             gp_num_colors_pow2;  // NOTE: No sort flag (unused?).\n" +
    "  buf[p++] = background;  // Background Color Index.\n" +
    "  buf[p++] = 0;  // Pixel aspect ratio (unused?).\n" +
    "\n" +
    "  // - Global Color Table\n" +
    "  if (global_palette !== null) {\n" +
    "    for (var i = 0, il = global_palette.length; i < il; ++i) {\n" +
    "      var rgb = global_palette[i];\n" +
    "      buf[p++] = rgb >> 16 & 0xff;\n" +
    "      buf[p++] = rgb >> 8 & 0xff;\n" +
    "      buf[p++] = rgb & 0xff;\n" +
    "    }\n" +
    "  }\n" +
    "\n" +
    "  if (loop_count !== null) {  // Netscape block for looping.\n" +
    "    if (loop_count < 0 || loop_count > 65535)\n" +
    "      throw \"Loop count invalid.\"\n" +
    "    // Extension code, label, and length.\n" +
    "    buf[p++] = 0x21; buf[p++] = 0xff; buf[p++] = 0x0b;\n" +
    "    // NETSCAPE2.0\n" +
    "    buf[p++] = 0x4e; buf[p++] = 0x45; buf[p++] = 0x54; buf[p++] = 0x53;\n" +
    "    buf[p++] = 0x43; buf[p++] = 0x41; buf[p++] = 0x50; buf[p++] = 0x45;\n" +
    "    buf[p++] = 0x32; buf[p++] = 0x2e; buf[p++] = 0x30;\n" +
    "    // Sub-block\n" +
    "    buf[p++] = 0x03; buf[p++] = 0x01;\n" +
    "    buf[p++] = loop_count & 0xff; buf[p++] = loop_count >> 8 & 0xff;\n" +
    "    buf[p++] = 0x00;  // Terminator.\n" +
    "  }\n" +
    "\n" +
    "\n" +
    "  var ended = false;\n" +
    "\n" +
    "  this.addFrame = function(x, y, w, h, indexed_pixels, opts) {\n" +
    "    if (ended === true) { --p; ended = false; }  // Un-end.\n" +
    "\n" +
    "    opts = opts === undefined ? { } : opts;\n" +
    "\n" +
    "    // TODO(deanm): Bounds check x, y.  Do they need to be within the virtual\n" +
    "    // canvas width/height, I imagine?\n" +
    "    if (x < 0 || y < 0 || x > 65535 || y > 65535)\n" +
    "      throw \"x/y invalid.\"\n" +
    "\n" +
    "    if (w <= 0 || h <= 0 || w > 65535 || h > 65535)\n" +
    "      throw \"Width/Height invalid.\"\n" +
    "\n" +
    "    if (indexed_pixels.length < w * h)\n" +
    "      throw \"Not enough pixels for the frame size.\";\n" +
    "\n" +
    "    var using_local_palette = true;\n" +
    "    var palette = opts.palette;\n" +
    "    if (palette === undefined || palette === null) {\n" +
    "      using_local_palette = false;\n" +
    "      palette = global_palette;\n" +
    "    }\n" +
    "\n" +
    "    if (palette === undefined || palette === null)\n" +
    "      throw \"Must supply either a local or global palette.\";\n" +
    "\n" +
    "    var num_colors = check_palette_and_num_colors(palette);\n" +
    "\n" +
    "    // Compute the min_code_size (power of 2), destroying num_colors.\n" +
    "    var min_code_size = 0;\n" +
    "    while (num_colors >>= 1) ++min_code_size;\n" +
    "    num_colors = 1 << min_code_size;  // Now we can easily get it back.\n" +
    "\n" +
    "    var delay = opts.delay === undefined ? 0 : opts.delay;\n" +
    "\n" +
    "    // From the spec:\n" +
    "    //     0 -   No disposal specified. The decoder is\n" +
    "    //           not required to take any action.\n" +
    "    //     1 -   Do not dispose. The graphic is to be left\n" +
    "    //           in place.\n" +
    "    //     2 -   Restore to background color. The area used by the\n" +
    "    //           graphic must be restored to the background color.\n" +
    "    //     3 -   Restore to previous. The decoder is required to\n" +
    "    //           restore the area overwritten by the graphic with\n" +
    "    //           what was there prior to rendering the graphic.\n" +
    "    //  4-7 -    To be defined.\n" +
    "    // NOTE(deanm): Dispose background doesn't really work, apparently most\n" +
    "    // browsers ignore the background palette index and clear to transparency.\n" +
    "    var disposal = opts.disposal === undefined ? 0 : opts.disposal;\n" +
    "    if (disposal < 0 || disposal > 3)  // 4-7 is reserved.\n" +
    "      throw \"Disposal out of range.\";\n" +
    "\n" +
    "    var use_transparency = false;\n" +
    "    var transparent_index = 0;\n" +
    "    if (opts.transparent !== undefined && opts.transparent !== null) {\n" +
    "      use_transparency = true;\n" +
    "      transparent_index = opts.transparent;\n" +
    "      if (transparent_index < 0 || transparent_index >= num_colors)\n" +
    "        throw \"Transparent color index.\";\n" +
    "    }\n" +
    "\n" +
    "    if (disposal !== 0 || use_transparency || delay !== 0) {\n" +
    "      // - Graphics Control Extension\n" +
    "      buf[p++] = 0x21; buf[p++] = 0xf9;  // Extension / Label.\n" +
    "      buf[p++] = 4;  // Byte size.\n" +
    "\n" +
    "      buf[p++] = disposal << 2 | (use_transparency === true ? 1 : 0);\n" +
    "      buf[p++] = delay & 0xff; buf[p++] = delay >> 8 & 0xff;\n" +
    "      buf[p++] = transparent_index;  // Transparent color index.\n" +
    "      buf[p++] = 0;  // Block Terminator.\n" +
    "    }\n" +
    "\n" +
    "    // - Image Descriptor\n" +
    "    buf[p++] = 0x2c;  // Image Seperator.\n" +
    "    buf[p++] = x & 0xff; buf[p++] = x >> 8 & 0xff;  // Left.\n" +
    "    buf[p++] = y & 0xff; buf[p++] = y >> 8 & 0xff;  // Top.\n" +
    "    buf[p++] = w & 0xff; buf[p++] = w >> 8 & 0xff;\n" +
    "    buf[p++] = h & 0xff; buf[p++] = h >> 8 & 0xff;\n" +
    "    // NOTE: No sort flag (unused?).\n" +
    "    // TODO(deanm): Support interlace.\n" +
    "    buf[p++] = using_local_palette === true ? (0x80 | (min_code_size-1)) : 0;\n" +
    "\n" +
    "    // - Local Color Table\n" +
    "    if (using_local_palette === true) {\n" +
    "      for (var i = 0, il = palette.length; i < il; ++i) {\n" +
    "        var rgb = palette[i];\n" +
    "        buf[p++] = rgb >> 16 & 0xff;\n" +
    "        buf[p++] = rgb >> 8 & 0xff;\n" +
    "        buf[p++] = rgb & 0xff;\n" +
    "      }\n" +
    "    }\n" +
    "\n" +
    "    p = GifWriterOutputLZWCodeStream(\n" +
    "            buf, p, min_code_size < 2 ? 2 : min_code_size, indexed_pixels);\n" +
    "  };\n" +
    "\n" +
    "  this.end = function() {\n" +
    "    if (ended === false) {\n" +
    "      buf[p++] = 0x3b;  // Trailer.\n" +
    "      ended = true;\n" +
    "    }\n" +
    "    return p;\n" +
    "  };\n" +
    "}\n" +
    "\n" +
    "// Main compression routine, palette indexes -> LZW code stream.\n" +
    "// |index_stream| must have at least one entry.\n" +
    "function GifWriterOutputLZWCodeStream(buf, p, min_code_size, index_stream) {\n" +
    "  buf[p++] = min_code_size;\n" +
    "  var cur_subblock = p++;  // Pointing at the length field.\n" +
    "\n" +
    "  var clear_code = 1 << min_code_size;\n" +
    "  var code_mask = clear_code - 1;\n" +
    "  var eoi_code = clear_code + 1;\n" +
    "  var next_code = eoi_code + 1;\n" +
    "\n" +
    "  var cur_code_size = min_code_size + 1;  // Number of bits per code.\n" +
    "  var cur_shift = 0;\n" +
    "  // We have at most 12-bit codes, so we should have to hold a max of 19\n" +
    "  // bits here (and then we would write out).\n" +
    "  var cur = 0;\n" +
    "\n" +
    "  function emit_bytes_to_buffer(bit_block_size) {\n" +
    "    while (cur_shift >= bit_block_size) {\n" +
    "      buf[p++] = cur & 0xff;\n" +
    "      cur >>= 8; cur_shift -= 8;\n" +
    "      if (p === cur_subblock + 256) {  // Finished a subblock.\n" +
    "        buf[cur_subblock] = 255;\n" +
    "        cur_subblock = p++;\n" +
    "      }\n" +
    "    }\n" +
    "  }\n" +
    "\n" +
    "  function emit_code(c) {\n" +
    "    cur |= c << cur_shift;\n" +
    "    cur_shift += cur_code_size;\n" +
    "    emit_bytes_to_buffer(8);\n" +
    "  }\n" +
    "\n" +
    "  // I am not an expert on the topic, and I don't want to write a thesis.\n" +
    "  // However, it is good to outline here the basic algorithm and the few data\n" +
    "  // structures and optimizations here that make this implementation fast.\n" +
    "  // The basic idea behind LZW is to build a table of previously seen runs\n" +
    "  // addressed by a short id (herein called output code).  All data is\n" +
    "  // referenced by a code, which represents one or more values from the\n" +
    "  // original input stream.  All input bytes can be referenced as the same\n" +
    "  // value as an output code.  So if you didn't want any compression, you\n" +
    "  // could more or less just output the original bytes as codes (there are\n" +
    "  // some details to this, but it is the idea).  In order to achieve\n" +
    "  // compression, values greater then the input range (codes can be up to\n" +
    "  // 12-bit while input only 8-bit) represent a sequence of previously seen\n" +
    "  // inputs.  The decompressor is able to build the same mapping while\n" +
    "  // decoding, so there is always a shared common knowledge between the\n" +
    "  // encoding and decoder, which is also important for \"timing\" aspects like\n" +
    "  // how to handle variable bit width code encoding.\n" +
    "  //\n" +
    "  // One obvious but very important consequence of the table system is there\n" +
    "  // is always a unique id (at most 12-bits) to map the runs.  'A' might be\n" +
    "  // 4, then 'AA' might be 10, 'AAA' 11, 'AAAA' 12, etc.  This relationship\n" +
    "  // can be used for an effecient lookup strategy for the code mapping.  We\n" +
    "  // need to know if a run has been seen before, and be able to map that run\n" +
    "  // to the output code.  Since we start with known unique ids (input bytes),\n" +
    "  // and then from those build more unique ids (table entries), we can\n" +
    "  // continue this chain (almost like a linked list) to always have small\n" +
    "  // integer values that represent the current byte chains in the encoder.\n" +
    "  // This means instead of tracking the input bytes (AAAABCD) to know our\n" +
    "  // current state, we can track the table entry for AAAABC (it is guaranteed\n" +
    "  // to exist by the nature of the algorithm) and the next character D.\n" +
    "  // Therefor the tuple of (table_entry, byte) is guaranteed to also be\n" +
    "  // unique.  This allows us to create a simple lookup key for mapping input\n" +
    "  // sequences to codes (table indices) without having to store or search\n" +
    "  // any of the code sequences.  So if 'AAAA' has a table entry of 12, the\n" +
    "  // tuple of ('AAAA', K) for any input byte K will be unique, and can be our\n" +
    "  // key.  This leads to a integer value at most 20-bits, which can always\n" +
    "  // fit in an SMI value and be used as a fast sparse array / object key.\n" +
    "\n" +
    "  // Output code for the current contents of the index buffer.\n" +
    "  var ib_code = index_stream[0] & code_mask;  // Load first input index.\n" +
    "  var code_table = { };  // Key'd on our 20-bit \"tuple\".\n" +
    "\n" +
    "  emit_code(clear_code);  // Spec says first code should be a clear code.\n" +
    "\n" +
    "  // First index already loaded, process the rest of the stream.\n" +
    "  for (var i = 1, il = index_stream.length; i < il; ++i) {\n" +
    "    var k = index_stream[i] & code_mask;\n" +
    "    var cur_key = ib_code << 8 | k;  // (prev, k) unique tuple.\n" +
    "    var cur_code = code_table[cur_key];  // buffer + k.\n" +
    "\n" +
    "    // Check if we have to create a new code table entry.\n" +
    "    if (cur_code === undefined) {  // We don't have buffer + k.\n" +
    "      // Emit index buffer (without k).\n" +
    "      // This is an inline version of emit_code, because this is the core\n" +
    "      // writing routine of the compressor (and V8 cannot inline emit_code\n" +
    "      // because it is a closure here in a different context).  Additionally\n" +
    "      // we can call emit_byte_to_buffer less often, because we can have\n" +
    "      // 30-bits (from our 31-bit signed SMI), and we know our codes will only\n" +
    "      // be 12-bits, so can safely have 18-bits there without overflow.\n" +
    "      // emit_code(ib_code);\n" +
    "      cur |= ib_code << cur_shift;\n" +
    "      cur_shift += cur_code_size;\n" +
    "      while (cur_shift >= 8) {\n" +
    "        buf[p++] = cur & 0xff;\n" +
    "        cur >>= 8; cur_shift -= 8;\n" +
    "        if (p === cur_subblock + 256) {  // Finished a subblock.\n" +
    "          buf[cur_subblock] = 255;\n" +
    "          cur_subblock = p++;\n" +
    "        }\n" +
    "      }\n" +
    "\n" +
    "      if (next_code === 4096) {  // Table full, need a clear.\n" +
    "        emit_code(clear_code);\n" +
    "        next_code = eoi_code + 1;\n" +
    "        cur_code_size = min_code_size + 1;\n" +
    "        code_table = { };\n" +
    "      } else {  // Table not full, insert a new entry.\n" +
    "        // Increase our variable bit code sizes if necessary.  This is a bit\n" +
    "        // tricky as it is based on \"timing\" between the encoding and\n" +
    "        // decoder.  From the encoders perspective this should happen after\n" +
    "        // we've already emitted the index buffer and are about to create the\n" +
    "        // first table entry that would overflow our current code bit size.\n" +
    "        if (next_code >= (1 << cur_code_size)) ++cur_code_size;\n" +
    "        code_table[cur_key] = next_code++;  // Insert into code table.\n" +
    "      }\n" +
    "\n" +
    "      ib_code = k;  // Index buffer to single input k.\n" +
    "    } else {\n" +
    "      ib_code = cur_code;  // Index buffer to sequence in code table.\n" +
    "    }\n" +
    "  }\n" +
    "\n" +
    "  emit_code(ib_code);  // There will still be something in the index buffer.\n" +
    "  emit_code(eoi_code);  // End Of Information.\n" +
    "\n" +
    "  // Flush / finalize the sub-blocks stream to the buffer.\n" +
    "  emit_bytes_to_buffer(1);\n" +
    "\n" +
    "  // Finish the sub-blocks, writing out any unfinished lengths and\n" +
    "  // terminating with a sub-block of length 0.  If we have already started\n" +
    "  // but not yet used a sub-block it can just become the terminator.\n" +
    "  if (cur_subblock + 1 === p) {  // Started but unused.\n" +
    "    buf[cur_subblock] = 0;\n" +
    "  } else {  // Started and used, write length and additional terminator block.\n" +
    "    buf[cur_subblock] = p - cur_subblock - 1;\n" +
    "    buf[p++] = 0;\n" +
    "  }\n" +
    "  return p;\n" +
    "}\n" +
    "\n" +
    "function GifReader(buf) {\n" +
    "  var p = 0;\n" +
    "\n" +
    "  // - Header.\n" +
    "  if (buf[p++] !== 0x47 || buf[p++] !== 0x49 || buf[p++] !== 0x46 ||  // GIF\n" +
    "      buf[p++] !== 0x38 || buf[p++] !== 0x39 || buf[p++] !== 0x61) {  // 89a\n" +
    "    throw \"Invalid GIF 89a header.\";\n" +
    "  }\n" +
    "\n" +
    "  // - Logical Screen Descriptor.\n" +
    "  var width = buf[p++] | buf[p++] << 8;\n" +
    "  var height = buf[p++] | buf[p++] << 8;\n" +
    "  var pf0 = buf[p++];  // <Packed Fields>.\n" +
    "  var global_palette_flag = pf0 >> 7;\n" +
    "  var num_global_colors_pow2 = pf0 & 0x7;\n" +
    "  var num_global_colors = 1 << (num_global_colors_pow2 + 1);\n" +
    "  var background = buf[p++];\n" +
    "  buf[p++];  // Pixel aspect ratio (unused?).\n" +
    "\n" +
    "  var global_palette_offset = null;\n" +
    "\n" +
    "  if (global_palette_flag) {\n" +
    "    global_palette_offset = p;\n" +
    "    p += num_global_colors * 3;  // Seek past palette.\n" +
    "  }\n" +
    "\n" +
    "  var loop_count = null;\n" +
    "\n" +
    "  var no_eof = true;\n" +
    "\n" +
    "  var frames = [ ];\n" +
    "\n" +
    "  var delay = 0;\n" +
    "  var transparent_index = null;\n" +
    "  var disposal = 0;  // 0 - No disposal specified.\n" +
    "  var loop_count = null;\n" +
    "\n" +
    "  this.width = width;\n" +
    "  this.height = height;\n" +
    "\n" +
    "  while (no_eof && p < buf.length) {\n" +
    "    switch (buf[p++]) {\n" +
    "      case 0x21:  // Graphics Control Extension Block\n" +
    "        switch (buf[p++]) {\n" +
    "          case 0xff:  // Application specific block\n" +
    "            // Try if it's a Netscape block (with animation loop counter).\n" +
    "            if (buf[p   ] !== 0x0b ||  // 21 FF already read, check block size.\n" +
    "                // NETSCAPE2.0\n" +
    "                buf[p+1 ] == 0x4e && buf[p+2 ] == 0x45 && buf[p+3 ] == 0x54 &&\n" +
    "                buf[p+4 ] == 0x53 && buf[p+5 ] == 0x43 && buf[p+6 ] == 0x41 &&\n" +
    "                buf[p+7 ] == 0x50 && buf[p+8 ] == 0x45 && buf[p+9 ] == 0x32 &&\n" +
    "                buf[p+10] == 0x2e && buf[p+11] == 0x30 &&\n" +
    "                // Sub-block\n" +
    "                buf[p+12] == 0x03 && buf[p+13] == 0x01 && buf[p+16] == 0) {\n" +
    "              p += 14;\n" +
    "              loop_count = buf[p++] | buf[p++] << 8;\n" +
    "              p++;  // Skip terminator.\n" +
    "            } else {  // We don't know what it is, just try to get past it.\n" +
    "              p += 12;\n" +
    "              while (true) {  // Seek through subblocks.\n" +
    "                var block_size = buf[p++];\n" +
    "                if (block_size === 0) break;\n" +
    "                p += block_size;\n" +
    "              }\n" +
    "            }\n" +
    "            break;\n" +
    "\n" +
    "          case 0xf9:  // Graphics Control Extension\n" +
    "            if (buf[p++] !== 0x4 || buf[p+4] !== 0)\n" +
    "              throw \"Invalid graphics extension block.\";\n" +
    "            var pf1 = buf[p++];\n" +
    "            delay = buf[p++] | buf[p++] << 8;\n" +
    "            transparent_index = buf[p++];\n" +
    "            if ((pf1 & 1) === 0) transparent_index = null;\n" +
    "            disposal = pf1 >> 2 & 0x7;\n" +
    "            p++;  // Skip terminator.\n" +
    "            break;\n" +
    "\n" +
    "          case 0xfe:  // Comment Extension.\n" +
    "            while (true) {  // Seek through subblocks.\n" +
    "              var block_size = buf[p++];\n" +
    "              if (block_size === 0) break;\n" +
    "              // console.log(buf.slice(p, p+block_size).toString('ascii'));\n" +
    "              p += block_size;\n" +
    "            }\n" +
    "            break;\n" +
    "\n" +
    "          default:\n" +
    "            throw \"Unknown graphic control label: 0x\" + buf[p-1].toString(16);\n" +
    "        }\n" +
    "        break;\n" +
    "\n" +
    "      case 0x2c:  // Image Descriptor.\n" +
    "        var x = buf[p++] | buf[p++] << 8;\n" +
    "        var y = buf[p++] | buf[p++] << 8;\n" +
    "        var w = buf[p++] | buf[p++] << 8;\n" +
    "        var h = buf[p++] | buf[p++] << 8;\n" +
    "        var pf2 = buf[p++];\n" +
    "        var local_palette_flag = pf2 >> 7;\n" +
    "        var num_local_colors_pow2 = pf2 & 0x7;\n" +
    "        var num_local_colors = 1 << (num_local_colors_pow2 + 1);\n" +
    "        var palette_offset = global_palette_offset;\n" +
    "        var has_local_palette = false;\n" +
    "        if (local_palette_flag) {\n" +
    "          var has_local_palette = true;\n" +
    "          palette_offset = p;  // Override with local palette.\n" +
    "          p += num_local_colors * 3;  // Seek past palette.\n" +
    "        }\n" +
    "\n" +
    "        var data_offset = p;\n" +
    "\n" +
    "        p++;  // codesize\n" +
    "        while (true) {\n" +
    "          var block_size = buf[p++];\n" +
    "          if (block_size === 0) break;\n" +
    "          p += block_size;\n" +
    "        }\n" +
    "\n" +
    "        frames.push({x: x, y: y, width: w, height: h,\n" +
    "                     has_local_palette: has_local_palette,\n" +
    "                     palette_offset: palette_offset,\n" +
    "                     data_offset: data_offset,\n" +
    "                     data_length: p - data_offset,\n" +
    "                     transparent_index: transparent_index,\n" +
    "                     delay: delay,\n" +
    "                     disposal: disposal});\n" +
    "        break;\n" +
    "\n" +
    "      case 0x3b:  // Trailer Marker (end of file).\n" +
    "        no_eof = false;\n" +
    "        break;\n" +
    "\n" +
    "      default:\n" +
    "        throw \"Unknown gif block: 0x\" + buf[p-1].toString(16);\n" +
    "        break;\n" +
    "    }\n" +
    "  }\n" +
    "\n" +
    "  this.numFrames = function() {\n" +
    "    return frames.length;\n" +
    "  };\n" +
    "\n" +
    "  this.frameInfo = function(frame_num) {\n" +
    "    if (frame_num < 0 || frame_num >= frames.length)\n" +
    "      throw \"Frame index out of range.\";\n" +
    "    return frames[frame_num];\n" +
    "  }\n" +
    "\n" +
    "  this.decodeAndBlitFrameBGRA = function(frame_num, pixels) {\n" +
    "    var frame = this.frameInfo(frame_num);\n" +
    "    var num_pixels = frame.width * frame.height;\n" +
    "    var index_stream = new Uint8Array(num_pixels);  // Atmost 8-bit indices.\n" +
    "    GifReaderLZWOutputIndexStream(\n" +
    "        buf, frame.data_offset, index_stream, num_pixels);\n" +
    "    var palette_offset = frame.palette_offset;\n" +
    "\n" +
    "    // NOTE(deanm): It seems to be much faster to compare index to 256 than\n" +
    "    // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in\n" +
    "    // the profile, not sure if it's related to using a Uint8Array.\n" +
    "    var trans = frame.transparent_index;\n" +
    "    if (trans === null) trans = 256;\n" +
    "\n" +
    "    var wstride = (width - frame.width) * 4;\n" +
    "    var op = ((frame.y * width) + frame.x) * 4;  // output pointer.\n" +
    "    var linex = frame.width;\n" +
    "\n" +
    "    for (var i = 0, il = index_stream.length; i < il; ++i) {\n" +
    "      var index = index_stream[i];\n" +
    "\n" +
    "      if (index === trans) {\n" +
    "        op += 4;\n" +
    "      } else {\n" +
    "        var r = buf[palette_offset + index * 3];\n" +
    "        var g = buf[palette_offset + index * 3 + 1];\n" +
    "        var b = buf[palette_offset + index * 3 + 2];\n" +
    "        pixels[op++] = b;\n" +
    "        pixels[op++] = g;\n" +
    "        pixels[op++] = r;\n" +
    "        pixels[op++] = 255;\n" +
    "      }\n" +
    "\n" +
    "      if (--linex === 0) {\n" +
    "        op += wstride;\n" +
    "        linex = frame.width;\n" +
    "      }\n" +
    "    }\n" +
    "  };\n" +
    "\n" +
    "  // I will go to copy and paste hell one day...\n" +
    "  this.decodeAndBlitFrameRGBA = function(frame_num, pixels) {\n" +
    "    var frame = this.frameInfo(frame_num);\n" +
    "    var num_pixels = frame.width * frame.height;\n" +
    "    var index_stream = new Uint8Array(num_pixels);  // Atmost 8-bit indices.\n" +
    "    GifReaderLZWOutputIndexStream(\n" +
    "        buf, frame.data_offset, index_stream, num_pixels);\n" +
    "    var op = 0;  // output pointer.\n" +
    "    var palette_offset = frame.palette_offset;\n" +
    "\n" +
    "    // NOTE(deanm): It seems to be much faster to compare index to 256 than\n" +
    "    // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in\n" +
    "    // the profile, not sure if it's related to using a Uint8Array.\n" +
    "    var trans = frame.transparent_index;\n" +
    "    if (trans === null) trans = 256;\n" +
    "\n" +
    "    var wstride = (width - frame.width) * 4;\n" +
    "    var op = ((frame.y * width) + frame.x) * 4;  // output pointer.\n" +
    "    var linex = frame.width;\n" +
    "\n" +
    "    for (var i = 0, il = index_stream.length; i < il; ++i) {\n" +
    "      var index = index_stream[i];\n" +
    "\n" +
    "      if (index === trans) {\n" +
    "        op += 4;\n" +
    "      } else {\n" +
    "        var r = buf[palette_offset + index * 3];\n" +
    "        var g = buf[palette_offset + index * 3 + 1];\n" +
    "        var b = buf[palette_offset + index * 3 + 2];\n" +
    "        pixels[op++] = r;\n" +
    "        pixels[op++] = g;\n" +
    "        pixels[op++] = b;\n" +
    "        pixels[op++] = 255;\n" +
    "      }\n" +
    "\n" +
    "      if (--linex === 0) {\n" +
    "        op += wstride;\n" +
    "        linex = frame.width;\n" +
    "      }\n" +
    "    }\n" +
    "  };\n" +
    "}\n" +
    "\n" +
    "function GifReaderLZWOutputIndexStream(code_stream, p, output, output_length) {\n" +
    "  var min_code_size = code_stream[p++];\n" +
    "\n" +
    "  var clear_code = 1 << min_code_size;\n" +
    "  var eoi_code = clear_code + 1;\n" +
    "  var next_code = eoi_code + 1;\n" +
    "\n" +
    "  var cur_code_size = min_code_size + 1;  // Number of bits per code.\n" +
    "  // NOTE: This shares the same name as the encoder, but has a different\n" +
    "  // meaning here.  Here this masks each code coming from the code stream.\n" +
    "  var code_mask = (1 << cur_code_size) - 1;\n" +
    "  var cur_shift = 0;\n" +
    "  var cur = 0;\n" +
    "\n" +
    "  var op = 0;  // Output pointer.\n" +
    "\n" +
    "  var subblock_size = code_stream[p++];\n" +
    "\n" +
    "  // TODO(deanm): Would using a TypedArray be any faster?  At least it would\n" +
    "  // solve the fast mode / backing store uncertainty.\n" +
    "  // var code_table = Array(4096);\n" +
    "  var code_table = new Int32Array(4096);  // Can be signed, we only use 20 bits.\n" +
    "\n" +
    "  var prev_code = null;  // Track code-1.\n" +
    "\n" +
    "  while (true) {\n" +
    "    // Read up to two bytes, making sure we always 12-bits for max sized code.\n" +
    "    while (cur_shift < 16) {\n" +
    "      if (subblock_size === 0) break;  // No more data to be read.\n" +
    "\n" +
    "      cur |= code_stream[p++] << cur_shift;\n" +
    "      cur_shift += 8;\n" +
    "\n" +
    "      if (subblock_size === 1) {  // Never let it get to 0 to hold logic above.\n" +
    "        subblock_size = code_stream[p++];  // Next subblock.\n" +
    "      } else {\n" +
    "        --subblock_size;\n" +
    "      }\n" +
    "    }\n" +
    "\n" +
    "    // TODO(deanm): We should never really get here, we should have received\n" +
    "    // and EOI.\n" +
    "    if (cur_shift < cur_code_size)\n" +
    "      break;\n" +
    "\n" +
    "    var code = cur & code_mask;\n" +
    "    cur >>= cur_code_size;\n" +
    "    cur_shift -= cur_code_size;\n" +
    "\n" +
    "    // TODO(deanm): Maybe should check that the first code was a clear code,\n" +
    "    // at least this is what you're supposed to do.  But actually our encoder\n" +
    "    // now doesn't emit a clear code first anyway.\n" +
    "    if (code === clear_code) {\n" +
    "      // We don't actually have to clear the table.  This could be a good idea\n" +
    "      // for greater error checking, but we don't really do any anyway.  We\n" +
    "      // will just track it with next_code and overwrite old entries.\n" +
    "\n" +
    "      next_code = eoi_code + 1;\n" +
    "      cur_code_size = min_code_size + 1;\n" +
    "      code_mask = (1 << cur_code_size) - 1;\n" +
    "\n" +
    "      // Don't update prev_code ?\n" +
    "      prev_code = null;\n" +
    "      continue;\n" +
    "    } else if (code === eoi_code) {\n" +
    "      break;\n" +
    "    }\n" +
    "\n" +
    "    // We have a similar situation as the decoder, where we want to store\n" +
    "    // variable length entries (code table entries), but we want to do in a\n" +
    "    // faster manner than an array of arrays.  The code below stores sort of a\n" +
    "    // linked list within the code table, and then \"chases\" through it to\n" +
    "    // construct the dictionary entries.  When a new entry is created, just the\n" +
    "    // last byte is stored, and the rest (prefix) of the entry is only\n" +
    "    // referenced by its table entry.  Then the code chases through the\n" +
    "    // prefixes until it reaches a single byte code.  We have to chase twice,\n" +
    "    // first to compute the length, and then to actually copy the data to the\n" +
    "    // output (backwards, since we know the length).  The alternative would be\n" +
    "    // storing something in an intermediate stack, but that doesn't make any\n" +
    "    // more sense.  I implemented an approach where it also stored the length\n" +
    "    // in the code table, although it's a bit tricky because you run out of\n" +
    "    // bits (12 + 12 + 8), but I didn't measure much improvements (the table\n" +
    "    // entries are generally not the long).  Even when I created benchmarks for\n" +
    "    // very long table entries the complexity did not seem worth it.\n" +
    "    // The code table stores the prefix entry in 12 bits and then the suffix\n" +
    "    // byte in 8 bits, so each entry is 20 bits.\n" +
    "\n" +
    "    var chase_code = code < next_code ? code : prev_code;\n" +
    "\n" +
    "    // Chase what we will output, either {CODE} or {CODE-1}.\n" +
    "    var chase_length = 0;\n" +
    "    var chase = chase_code;\n" +
    "    while (chase > clear_code) {\n" +
    "      chase = code_table[chase] >> 8;\n" +
    "      ++chase_length;\n" +
    "    }\n" +
    "\n" +
    "    var k = chase;\n" +
    "\n" +
    "    var op_end = op + chase_length + (chase_code !== code ? 1 : 0);\n" +
    "    if (op_end > output_length) {\n" +
    "      console.log(\"Warning, gif stream longer than expected.\");\n" +
    "      return;\n" +
    "    }\n" +
    "\n" +
    "    // Already have the first byte from the chase, might as well write it fast.\n" +
    "    output[op++] = k;\n" +
    "\n" +
    "    op += chase_length;\n" +
    "    var b = op;  // Track pointer, writing backwards.\n" +
    "\n" +
    "    if (chase_code !== code)  // The case of emitting {CODE-1} + k.\n" +
    "      output[op++] = k;\n" +
    "\n" +
    "    chase = chase_code;\n" +
    "    while (chase_length--) {\n" +
    "      chase = code_table[chase];\n" +
    "      output[--b] = chase & 0xff;  // Write backwards.\n" +
    "      chase >>= 8;  // Pull down to the prefix code.\n" +
    "    }\n" +
    "\n" +
    "    if (prev_code !== null && next_code < 4096) {\n" +
    "      code_table[next_code++] = prev_code << 8 | k;\n" +
    "      // TODO(deanm): Figure out this clearing vs code growth logic better.  I\n" +
    "      // have an feeling that it should just happen somewhere else, for now it\n" +
    "      // is awkward between when we grow past the max and then hit a clear code.\n" +
    "      // For now just check if we hit the max 12-bits (then a clear code should\n" +
    "      // follow, also of course encoded in 12-bits).\n" +
    "      if (next_code >= code_mask+1 && cur_code_size < 12) {\n" +
    "        ++cur_code_size;\n" +
    "        code_mask = code_mask << 1 | 1;\n" +
    "      }\n" +
    "    }\n" +
    "\n" +
    "    prev_code = code;\n" +
    "  }\n" +
    "\n" +
    "  if (op !== output_length) {\n" +
    "    console.log(\"Warning, gif stream shorter than expected.\");\n" +
    "  }\n" +
    "\n" +
    "  return output;\n" +
    "}\n" +
    "\n" +
    "try { exports.GifWriter = GifWriter; exports.GifReader = GifReader } catch(e) { }  // CommonJS.\n"
  );
}]);