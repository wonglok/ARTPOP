(function(self){

  /* base64 encode/decode compatible with window.btoa/atob
 *
 * window.atob/btoa is a Firefox extension to convert binary data (the "b")
 * to base64 (ascii, the "a").
 *
 * It is also found in Safari and Chrome.  It is not available in IE.
 *
 * if (!window.btoa) window.btoa = base64.encode
 * if (!window.atob) window.atob = base64.decode
 *
 * The original spec's for atob/btoa are a bit lacking
 * https://developer.mozilla.org/en/DOM/window.atob
 * https://developer.mozilla.org/en/DOM/window.btoa
 *
 * window.btoa and base64.encode takes a string where charCodeAt is [0,255]
 * If any character is not [0,255], then an exception is thrown.
 *
 * window.atob and base64.decode take a base64-encoded string
 * If the input length is not a multiple of 4, or contains invalid characters
 *   then an exception is thrown.
 */
base64 = {};
base64.PADCHAR = '=';
base64.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
base64.getbyte64 = function(s,i) {
    // This is oddly fast, except on Chrome/V8.
    //  Minimal or no improvement in performance by using a
    //   object with properties mapping chars to value (eg. 'A': 0)
    var idx = base64.ALPHA.indexOf(s.charAt(i));
    if (idx == -1) {
  throw "Cannot decode base64";
    }
    return idx;
};

base64.decode = function(s) {
    // convert to string
    s = "" + s;
    var getbyte64 = base64.getbyte64;
    var pads, i, b10;
    var imax = s.length
    if (imax == 0) {
        return s;
    }

    if (imax % 4 != 0) {
  throw "Cannot decode base64";
    }

    pads = 0
    if (s.charAt(imax -1) == base64.PADCHAR) {
        pads = 1;
        if (s.charAt(imax -2) == base64.PADCHAR) {
            pads = 2;
        }
        // either way, we want to ignore this last block
        imax -= 4;
    }

    var x = [];
    for (i = 0; i < imax; i += 4) {
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) |
            (getbyte64(s,i+2) << 6) | getbyte64(s,i+3);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
    }

    switch (pads) {
    case 1:
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) | (getbyte64(s,i+2) << 6)
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
        break;
    case 2:
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12);
        x.push(String.fromCharCode(b10 >> 16));
        break;
    }
    return x.join('');
};

base64.getbyte = function(s,i) {
    var x = s.charCodeAt(i);
    if (x > 255) {
        throw "INVALID_CHARACTER_ERR: DOM Exception 5";
    }
    return x;
};


base64.encode = function(s) {
    if (arguments.length != 1) {
  throw "SyntaxError: Not enough arguments";
    }
    var padchar = base64.PADCHAR;
    var alpha   = base64.ALPHA;
    var getbyte = base64.getbyte;

    var i, b10;
    var x = [];

    // convert to string
    s = "" + s;

    var imax = s.length - s.length % 3;

    if (s.length == 0) {
        return s;
    }
    for (i = 0; i < imax; i += 3) {
        b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8) | getbyte(s,i+2);
        x.push(alpha.charAt(b10 >> 18));
        x.push(alpha.charAt((b10 >> 12) & 0x3F));
        x.push(alpha.charAt((b10 >> 6) & 0x3f));
        x.push(alpha.charAt(b10 & 0x3f));
    }
    switch (s.length - imax) {
    case 1:
        b10 = getbyte(s,i) << 16;
        x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
               padchar + padchar);
        break;
    case 2:
        b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8);
        x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
               alpha.charAt((b10 >> 6) & 0x3f) + padchar);
        break;
    }
    return x.join('');
};

self.base64 = base64;

})(this);



/*
  Gluing OMGGIF and NeuQuant.js in a worker, by Forrest Oliphant for meemoo.org

  Message to worker should be an object with
  {
    frames: (array of pixel data objects),
    delay: (ms delay per frame),
    matte: ([r,g,b] (default white)),
    transparent: ([r,g,b] (optional))
  }

  Messages from worker will either be
  {
    type: "progress",
    data: (percent done, 0.0-1.0)
  }
  or
  {
    type: "gif",
    data: (binary gif data),
    frameCount: (number of frames),
    encodeTime: (ms how long it took to encode)
  }

*/


// (c) Dean McNamee <dean@gmail.com>, 2013.
//
// https://github.com/deanm/omggif
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
//
// omggif is a JavaScript implementation of a GIF 89a encoder, including
// animation and compression.  It does not rely on any specific underlying
// system, so should run in the browser, Node, or Plask.
(function(exports){

  
  function GifWriter(buf, width, height, gopts) {
  var p = 0;

  var gopts = gopts === undefined ? { } : gopts;
  var loop_count = gopts.loop === undefined ? null : gopts.loop;
  var global_palette = gopts.palette === undefined ? null : gopts.palette;

  if (width <= 0 || height <= 0 || width > 65535 || height > 65535)
    throw "Width/Height invalid."

  function check_palette_and_num_colors(palette) {
    var num_colors = palette.length;
    if (num_colors < 2 || num_colors > 256 ||  num_colors & (num_colors-1))
      throw "Invalid code/color length ("+num_colors+"), must be power of 2 and 2 .. 256.";
    return num_colors;
  }

  // - Header.
  buf[p++] = 0x47; buf[p++] = 0x49; buf[p++] = 0x46;  // GIF
  buf[p++] = 0x38; buf[p++] = 0x39; buf[p++] = 0x61;  // 89a

  // Handling of Global Color Table (palette) and background index.
  var gp_num_colors_pow2 = 0;
  var background = 0;
  if (global_palette !== null) {
    var gp_num_colors = check_palette_and_num_colors(global_palette);
    while (gp_num_colors >>= 1) ++gp_num_colors_pow2;
    gp_num_colors = 1 << gp_num_colors_pow2;
    --gp_num_colors_pow2;
    if (gopts.background !== undefined) {
      background = gopts.background;
      if (background >= gp_num_colors) throw "Background index out of range.";
      // The GIF spec states that a background index of 0 should be ignored, so
      // this is probably a mistake and you really want to set it to another
      // slot in the palette.  But actually in the end most browsers, etc end
      // up ignoring this almost completely (including for dispose background).
      if (background === 0)
        throw "Background index explicitly passed as 0.";
    }
  }

  // - Logical Screen Descriptor.
  // NOTE(deanm): w/h apparently ignored by implementations, but set anyway.
  buf[p++] = width & 0xff; buf[p++] = width >> 8 & 0xff;
  buf[p++] = height & 0xff; buf[p++] = height >> 8 & 0xff;
  // NOTE: Indicates 0-bpp original color resolution (unused?).
  buf[p++] = (global_palette !== null ? 0x80 : 0) |  // Global Color Table Flag.
             gp_num_colors_pow2;  // NOTE: No sort flag (unused?).
  buf[p++] = background;  // Background Color Index.
  buf[p++] = 0;  // Pixel aspect ratio (unused?).

  // - Global Color Table
  if (global_palette !== null) {
    for (var i = 0, il = global_palette.length; i < il; ++i) {
      var rgb = global_palette[i];
      buf[p++] = rgb >> 16 & 0xff;
      buf[p++] = rgb >> 8 & 0xff;
      buf[p++] = rgb & 0xff;
    }
  }

  if (loop_count !== null) {  // Netscape block for looping.
    if (loop_count < 0 || loop_count > 65535)
      throw "Loop count invalid."
    // Extension code, label, and length.
    buf[p++] = 0x21; buf[p++] = 0xff; buf[p++] = 0x0b;
    // NETSCAPE2.0
    buf[p++] = 0x4e; buf[p++] = 0x45; buf[p++] = 0x54; buf[p++] = 0x53;
    buf[p++] = 0x43; buf[p++] = 0x41; buf[p++] = 0x50; buf[p++] = 0x45;
    buf[p++] = 0x32; buf[p++] = 0x2e; buf[p++] = 0x30;
    // Sub-block
    buf[p++] = 0x03; buf[p++] = 0x01;
    buf[p++] = loop_count & 0xff; buf[p++] = loop_count >> 8 & 0xff;
    buf[p++] = 0x00;  // Terminator.
  }


  var ended = false;

  this.addFrame = function(x, y, w, h, indexed_pixels, opts) {
    if (ended === true) { --p; ended = false; }  // Un-end.

    opts = opts === undefined ? { } : opts;

    // TODO(deanm): Bounds check x, y.  Do they need to be within the virtual
    // canvas width/height, I imagine?
    if (x < 0 || y < 0 || x > 65535 || y > 65535)
      throw "x/y invalid."

    if (w <= 0 || h <= 0 || w > 65535 || h > 65535)
      throw "Width/Height invalid."

    if (indexed_pixels.length < w * h)
      throw "Not enough pixels for the frame size.";

    var using_local_palette = true;
    var palette = opts.palette;
    if (palette === undefined || palette === null) {
      using_local_palette = false;
      palette = global_palette;
    }

    if (palette === undefined || palette === null)
      throw "Must supply either a local or global palette.";

    var num_colors = check_palette_and_num_colors(palette);

    // Compute the min_code_size (power of 2), destroying num_colors.
    var min_code_size = 0;
    while (num_colors >>= 1) ++min_code_size;
    num_colors = 1 << min_code_size;  // Now we can easily get it back.

    var delay = opts.delay === undefined ? 0 : opts.delay;

    // From the spec:
    //     0 -   No disposal specified. The decoder is
    //           not required to take any action.
    //     1 -   Do not dispose. The graphic is to be left
    //           in place.
    //     2 -   Restore to background color. The area used by the
    //           graphic must be restored to the background color.
    //     3 -   Restore to previous. The decoder is required to
    //           restore the area overwritten by the graphic with
    //           what was there prior to rendering the graphic.
    //  4-7 -    To be defined.
    // NOTE(deanm): Dispose background doesn't really work, apparently most
    // browsers ignore the background palette index and clear to transparency.
    var disposal = opts.disposal === undefined ? 0 : opts.disposal;
    if (disposal < 0 || disposal > 3)  // 4-7 is reserved.
      throw "Disposal out of range.";

    var use_transparency = false;
    var transparent_index = 0;
    if (opts.transparent !== undefined && opts.transparent !== null) {
      use_transparency = true;
      transparent_index = opts.transparent;
      if (transparent_index < 0 || transparent_index >= num_colors)
        throw "Transparent color index.";
    }

    if (disposal !== 0 || use_transparency || delay !== 0) {
      // - Graphics Control Extension
      buf[p++] = 0x21; buf[p++] = 0xf9;  // Extension / Label.
      buf[p++] = 4;  // Byte size.

      buf[p++] = disposal << 2 | (use_transparency === true ? 1 : 0);
      buf[p++] = delay & 0xff; buf[p++] = delay >> 8 & 0xff;
      buf[p++] = transparent_index;  // Transparent color index.
      buf[p++] = 0;  // Block Terminator.
    }

    // - Image Descriptor
    buf[p++] = 0x2c;  // Image Seperator.
    buf[p++] = x & 0xff; buf[p++] = x >> 8 & 0xff;  // Left.
    buf[p++] = y & 0xff; buf[p++] = y >> 8 & 0xff;  // Top.
    buf[p++] = w & 0xff; buf[p++] = w >> 8 & 0xff;
    buf[p++] = h & 0xff; buf[p++] = h >> 8 & 0xff;
    // NOTE: No sort flag (unused?).
    // TODO(deanm): Support interlace.
    buf[p++] = using_local_palette === true ? (0x80 | (min_code_size-1)) : 0;

    // - Local Color Table
    if (using_local_palette === true) {
      for (var i = 0, il = palette.length; i < il; ++i) {
        var rgb = palette[i];
        buf[p++] = rgb >> 16 & 0xff;
        buf[p++] = rgb >> 8 & 0xff;
        buf[p++] = rgb & 0xff;
      }
    }

    p = GifWriterOutputLZWCodeStream(
            buf, p, min_code_size < 2 ? 2 : min_code_size, indexed_pixels);
  };

  this.end = function() {
    if (ended === false) {
      buf[p++] = 0x3b;  // Trailer.
      ended = true;
    }
    return p;
  };
}

// Main compression routine, palette indexes -> LZW code stream.
// |index_stream| must have at least one entry.
function GifWriterOutputLZWCodeStream(buf, p, min_code_size, index_stream) {
  buf[p++] = min_code_size;
  var cur_subblock = p++;  // Pointing at the length field.

  var clear_code = 1 << min_code_size;
  var code_mask = clear_code - 1;
  var eoi_code = clear_code + 1;
  var next_code = eoi_code + 1;

  var cur_code_size = min_code_size + 1;  // Number of bits per code.
  var cur_shift = 0;
  // We have at most 12-bit codes, so we should have to hold a max of 19
  // bits here (and then we would write out).
  var cur = 0;

  function emit_bytes_to_buffer(bit_block_size) {
    while (cur_shift >= bit_block_size) {
      buf[p++] = cur & 0xff;
      cur >>= 8; cur_shift -= 8;
      if (p === cur_subblock + 256) {  // Finished a subblock.
        buf[cur_subblock] = 255;
        cur_subblock = p++;
      }
    }
  }

  function emit_code(c) {
    cur |= c << cur_shift;
    cur_shift += cur_code_size;
    emit_bytes_to_buffer(8);
  }

  // I am not an expert on the topic, and I don't want to write a thesis.
  // However, it is good to outline here the basic algorithm and the few data
  // structures and optimizations here that make this implementation fast.
  // The basic idea behind LZW is to build a table of previously seen runs
  // addressed by a short id (herein called output code).  All data is
  // referenced by a code, which represents one or more values from the
  // original input stream.  All input bytes can be referenced as the same
  // value as an output code.  So if you didn't want any compression, you
  // could more or less just output the original bytes as codes (there are
  // some details to this, but it is the idea).  In order to achieve
  // compression, values greater then the input range (codes can be up to
  // 12-bit while input only 8-bit) represent a sequence of previously seen
  // inputs.  The decompressor is able to build the same mapping while
  // decoding, so there is always a shared common knowledge between the
  // encoding and decoder, which is also important for "timing" aspects like
  // how to handle variable bit width code encoding.
  //
  // One obvious but very important consequence of the table system is there
  // is always a unique id (at most 12-bits) to map the runs.  'A' might be
  // 4, then 'AA' might be 10, 'AAA' 11, 'AAAA' 12, etc.  This relationship
  // can be used for an effecient lookup strategy for the code mapping.  We
  // need to know if a run has been seen before, and be able to map that run
  // to the output code.  Since we start with known unique ids (input bytes),
  // and then from those build more unique ids (table entries), we can
  // continue this chain (almost like a linked list) to always have small
  // integer values that represent the current byte chains in the encoder.
  // This means instead of tracking the input bytes (AAAABCD) to know our
  // current state, we can track the table entry for AAAABC (it is guaranteed
  // to exist by the nature of the algorithm) and the next character D.
  // Therefor the tuple of (table_entry, byte) is guaranteed to also be
  // unique.  This allows us to create a simple lookup key for mapping input
  // sequences to codes (table indices) without having to store or search
  // any of the code sequences.  So if 'AAAA' has a table entry of 12, the
  // tuple of ('AAAA', K) for any input byte K will be unique, and can be our
  // key.  This leads to a integer value at most 20-bits, which can always
  // fit in an SMI value and be used as a fast sparse array / object key.

  // Output code for the current contents of the index buffer.
  var ib_code = index_stream[0] & code_mask;  // Load first input index.
  var code_table = { };  // Key'd on our 20-bit "tuple".

  emit_code(clear_code);  // Spec says first code should be a clear code.

  // First index already loaded, process the rest of the stream.
  for (var i = 1, il = index_stream.length; i < il; ++i) {
    var k = index_stream[i] & code_mask;
    var cur_key = ib_code << 8 | k;  // (prev, k) unique tuple.
    var cur_code = code_table[cur_key];  // buffer + k.

    // Check if we have to create a new code table entry.
    if (cur_code === undefined) {  // We don't have buffer + k.
      // Emit index buffer (without k).
      // This is an inline version of emit_code, because this is the core
      // writing routine of the compressor (and V8 cannot inline emit_code
      // because it is a closure here in a different context).  Additionally
      // we can call emit_byte_to_buffer less often, because we can have
      // 30-bits (from our 31-bit signed SMI), and we know our codes will only
      // be 12-bits, so can safely have 18-bits there without overflow.
      // emit_code(ib_code);
      cur |= ib_code << cur_shift;
      cur_shift += cur_code_size;
      while (cur_shift >= 8) {
        buf[p++] = cur & 0xff;
        cur >>= 8; cur_shift -= 8;
        if (p === cur_subblock + 256) {  // Finished a subblock.
          buf[cur_subblock] = 255;
          cur_subblock = p++;
        }
      }

      if (next_code === 4096) {  // Table full, need a clear.
        emit_code(clear_code);
        next_code = eoi_code + 1;
        cur_code_size = min_code_size + 1;
        code_table = { };
      } else {  // Table not full, insert a new entry.
        // Increase our variable bit code sizes if necessary.  This is a bit
        // tricky as it is based on "timing" between the encoding and
        // decoder.  From the encoders perspective this should happen after
        // we've already emitted the index buffer and are about to create the
        // first table entry that would overflow our current code bit size.
        if (next_code >= (1 << cur_code_size)) ++cur_code_size;
        code_table[cur_key] = next_code++;  // Insert into code table.
      }

      ib_code = k;  // Index buffer to single input k.
    } else {
      ib_code = cur_code;  // Index buffer to sequence in code table.
    }
  }

  emit_code(ib_code);  // There will still be something in the index buffer.
  emit_code(eoi_code);  // End Of Information.

  // Flush / finalize the sub-blocks stream to the buffer.
  emit_bytes_to_buffer(1);

  // Finish the sub-blocks, writing out any unfinished lengths and
  // terminating with a sub-block of length 0.  If we have already started
  // but not yet used a sub-block it can just become the terminator.
  if (cur_subblock + 1 === p) {  // Started but unused.
    buf[cur_subblock] = 0;
  } else {  // Started and used, write length and additional terminator block.
    buf[cur_subblock] = p - cur_subblock - 1;
    buf[p++] = 0;
  }
  return p;
}

function GifReader(buf) {
  var p = 0;

  // - Header.
  if (buf[p++] !== 0x47 || buf[p++] !== 0x49 || buf[p++] !== 0x46 ||  // GIF
      buf[p++] !== 0x38 || buf[p++] !== 0x39 || buf[p++] !== 0x61) {  // 89a
    throw "Invalid GIF 89a header.";
  }

  // - Logical Screen Descriptor.
  var width = buf[p++] | buf[p++] << 8;
  var height = buf[p++] | buf[p++] << 8;
  var pf0 = buf[p++];  // <Packed Fields>.
  var global_palette_flag = pf0 >> 7;
  var num_global_colors_pow2 = pf0 & 0x7;
  var num_global_colors = 1 << (num_global_colors_pow2 + 1);
  var background = buf[p++];
  buf[p++];  // Pixel aspect ratio (unused?).

  var global_palette_offset = null;

  if (global_palette_flag) {
    global_palette_offset = p;
    p += num_global_colors * 3;  // Seek past palette.
  }

  var loop_count = null;

  var no_eof = true;

  var frames = [ ];

  var delay = 0;
  var transparent_index = null;
  var disposal = 0;  // 0 - No disposal specified.
  var loop_count = null;

  this.width = width;
  this.height = height;

  while (no_eof && p < buf.length) {
    switch (buf[p++]) {
      case 0x21:  // Graphics Control Extension Block
        switch (buf[p++]) {
          case 0xff:  // Application specific block
            // Try if it's a Netscape block (with animation loop counter).
            if (buf[p   ] !== 0x0b ||  // 21 FF already read, check block size.
                // NETSCAPE2.0
                buf[p+1 ] == 0x4e && buf[p+2 ] == 0x45 && buf[p+3 ] == 0x54 &&
                buf[p+4 ] == 0x53 && buf[p+5 ] == 0x43 && buf[p+6 ] == 0x41 &&
                buf[p+7 ] == 0x50 && buf[p+8 ] == 0x45 && buf[p+9 ] == 0x32 &&
                buf[p+10] == 0x2e && buf[p+11] == 0x30 &&
                // Sub-block
                buf[p+12] == 0x03 && buf[p+13] == 0x01 && buf[p+16] == 0) {
              p += 14;
              loop_count = buf[p++] | buf[p++] << 8;
              p++;  // Skip terminator.
            } else {  // We don't know what it is, just try to get past it.
              p += 12;
              while (true) {  // Seek through subblocks.
                var block_size = buf[p++];
                if (block_size === 0) break;
                p += block_size;
              }
            }
            break;

          case 0xf9:  // Graphics Control Extension
            if (buf[p++] !== 0x4 || buf[p+4] !== 0)
              throw "Invalid graphics extension block.";
            var pf1 = buf[p++];
            delay = buf[p++] | buf[p++] << 8;
            transparent_index = buf[p++];
            if ((pf1 & 1) === 0) transparent_index = null;
            disposal = pf1 >> 2 & 0x7;
            p++;  // Skip terminator.
            break;

          case 0xfe:  // Comment Extension.
            while (true) {  // Seek through subblocks.
              var block_size = buf[p++];
              if (block_size === 0) break;
              // console.log(buf.slice(p, p+block_size).toString('ascii'));
              p += block_size;
            }
            break;

          default:
            throw "Unknown graphic control label: 0x" + buf[p-1].toString(16);
        }
        break;

      case 0x2c:  // Image Descriptor.
        var x = buf[p++] | buf[p++] << 8;
        var y = buf[p++] | buf[p++] << 8;
        var w = buf[p++] | buf[p++] << 8;
        var h = buf[p++] | buf[p++] << 8;
        var pf2 = buf[p++];
        var local_palette_flag = pf2 >> 7;
        var num_local_colors_pow2 = pf2 & 0x7;
        var num_local_colors = 1 << (num_local_colors_pow2 + 1);
        var palette_offset = global_palette_offset;
        var has_local_palette = false;
        if (local_palette_flag) {
          var has_local_palette = true;
          palette_offset = p;  // Override with local palette.
          p += num_local_colors * 3;  // Seek past palette.
        }

        var data_offset = p;

        p++;  // codesize
        while (true) {
          var block_size = buf[p++];
          if (block_size === 0) break;
          p += block_size;
        }

        frames.push({x: x, y: y, width: w, height: h,
                     has_local_palette: has_local_palette,
                     palette_offset: palette_offset,
                     data_offset: data_offset,
                     data_length: p - data_offset,
                     transparent_index: transparent_index,
                     delay: delay,
                     disposal: disposal});
        break;

      case 0x3b:  // Trailer Marker (end of file).
        no_eof = false;
        break;

      default:
        throw "Unknown gif block: 0x" + buf[p-1].toString(16);
        break;
    }
  }

  this.numFrames = function() {
    return frames.length;
  };

  this.frameInfo = function(frame_num) {
    if (frame_num < 0 || frame_num >= frames.length)
      throw "Frame index out of range.";
    return frames[frame_num];
  }

  this.decodeAndBlitFrameBGRA = function(frame_num, pixels) {
    var frame = this.frameInfo(frame_num);
    var num_pixels = frame.width * frame.height;
    var index_stream = new Uint8Array(num_pixels);  // Atmost 8-bit indices.
    GifReaderLZWOutputIndexStream(
        buf, frame.data_offset, index_stream, num_pixels);
    var palette_offset = frame.palette_offset;

    // NOTE(deanm): It seems to be much faster to compare index to 256 than
    // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in
    // the profile, not sure if it's related to using a Uint8Array.
    var trans = frame.transparent_index;
    if (trans === null) trans = 256;

    var wstride = (width - frame.width) * 4;
    var op = ((frame.y * width) + frame.x) * 4;  // output pointer.
    var linex = frame.width;

    for (var i = 0, il = index_stream.length; i < il; ++i) {
      var index = index_stream[i];

      if (index === trans) {
        op += 4;
      } else {
        var r = buf[palette_offset + index * 3];
        var g = buf[palette_offset + index * 3 + 1];
        var b = buf[palette_offset + index * 3 + 2];
        pixels[op++] = b;
        pixels[op++] = g;
        pixels[op++] = r;
        pixels[op++] = 255;
      }

      if (--linex === 0) {
        op += wstride;
        linex = frame.width;
      }
    }
  };

  // I will go to copy and paste hell one day...
  this.decodeAndBlitFrameRGBA = function(frame_num, pixels) {
    var frame = this.frameInfo(frame_num);
    var num_pixels = frame.width * frame.height;
    var index_stream = new Uint8Array(num_pixels);  // Atmost 8-bit indices.
    GifReaderLZWOutputIndexStream(
        buf, frame.data_offset, index_stream, num_pixels);
    var op = 0;  // output pointer.
    var palette_offset = frame.palette_offset;

    // NOTE(deanm): It seems to be much faster to compare index to 256 than
    // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in
    // the profile, not sure if it's related to using a Uint8Array.
    var trans = frame.transparent_index;
    if (trans === null) trans = 256;

    var wstride = (width - frame.width) * 4;
    var op = ((frame.y * width) + frame.x) * 4;  // output pointer.
    var linex = frame.width;

    for (var i = 0, il = index_stream.length; i < il; ++i) {
      var index = index_stream[i];

      if (index === trans) {
        op += 4;
      } else {
        var r = buf[palette_offset + index * 3];
        var g = buf[palette_offset + index * 3 + 1];
        var b = buf[palette_offset + index * 3 + 2];
        pixels[op++] = r;
        pixels[op++] = g;
        pixels[op++] = b;
        pixels[op++] = 255;
      }

      if (--linex === 0) {
        op += wstride;
        linex = frame.width;
      }
    }
  };
}

function GifReaderLZWOutputIndexStream(code_stream, p, output, output_length) {
  var min_code_size = code_stream[p++];

  var clear_code = 1 << min_code_size;
  var eoi_code = clear_code + 1;
  var next_code = eoi_code + 1;

  var cur_code_size = min_code_size + 1;  // Number of bits per code.
  // NOTE: This shares the same name as the encoder, but has a different
  // meaning here.  Here this masks each code coming from the code stream.
  var code_mask = (1 << cur_code_size) - 1;
  var cur_shift = 0;
  var cur = 0;

  var op = 0;  // Output pointer.

  var subblock_size = code_stream[p++];

  // TODO(deanm): Would using a TypedArray be any faster?  At least it would
  // solve the fast mode / backing store uncertainty.
  // var code_table = Array(4096);
  var code_table = new Int32Array(4096);  // Can be signed, we only use 20 bits.

  var prev_code = null;  // Track code-1.

  while (true) {
    // Read up to two bytes, making sure we always 12-bits for max sized code.
    while (cur_shift < 16) {
      if (subblock_size === 0) break;  // No more data to be read.

      cur |= code_stream[p++] << cur_shift;
      cur_shift += 8;

      if (subblock_size === 1) {  // Never let it get to 0 to hold logic above.
        subblock_size = code_stream[p++];  // Next subblock.
      } else {
        --subblock_size;
      }
    }

    // TODO(deanm): We should never really get here, we should have received
    // and EOI.
    if (cur_shift < cur_code_size)
      break;

    var code = cur & code_mask;
    cur >>= cur_code_size;
    cur_shift -= cur_code_size;

    // TODO(deanm): Maybe should check that the first code was a clear code,
    // at least this is what you're supposed to do.  But actually our encoder
    // now doesn't emit a clear code first anyway.
    if (code === clear_code) {
      // We don't actually have to clear the table.  This could be a good idea
      // for greater error checking, but we don't really do any anyway.  We
      // will just track it with next_code and overwrite old entries.

      next_code = eoi_code + 1;
      cur_code_size = min_code_size + 1;
      code_mask = (1 << cur_code_size) - 1;

      // Don't update prev_code ?
      prev_code = null;
      continue;
    } else if (code === eoi_code) {
      break;
    }

    // We have a similar situation as the decoder, where we want to store
    // variable length entries (code table entries), but we want to do in a
    // faster manner than an array of arrays.  The code below stores sort of a
    // linked list within the code table, and then "chases" through it to
    // construct the dictionary entries.  When a new entry is created, just the
    // last byte is stored, and the rest (prefix) of the entry is only
    // referenced by its table entry.  Then the code chases through the
    // prefixes until it reaches a single byte code.  We have to chase twice,
    // first to compute the length, and then to actually copy the data to the
    // output (backwards, since we know the length).  The alternative would be
    // storing something in an intermediate stack, but that doesn't make any
    // more sense.  I implemented an approach where it also stored the length
    // in the code table, although it's a bit tricky because you run out of
    // bits (12 + 12 + 8), but I didn't measure much improvements (the table
    // entries are generally not the long).  Even when I created benchmarks for
    // very long table entries the complexity did not seem worth it.
    // The code table stores the prefix entry in 12 bits and then the suffix
    // byte in 8 bits, so each entry is 20 bits.

    var chase_code = code < next_code ? code : prev_code;

    // Chase what we will output, either {CODE} or {CODE-1}.
    var chase_length = 0;
    var chase = chase_code;
    while (chase > clear_code) {
      chase = code_table[chase] >> 8;
      ++chase_length;
    }

    var k = chase;

    var op_end = op + chase_length + (chase_code !== code ? 1 : 0);
    if (op_end > output_length) {
      console.log("Warning, gif stream longer than expected.");
      return;
    }

    // Already have the first byte from the chase, might as well write it fast.
    output[op++] = k;

    op += chase_length;
    var b = op;  // Track pointer, writing backwards.

    if (chase_code !== code)  // The case of emitting {CODE-1} + k.
      output[op++] = k;

    chase = chase_code;
    while (chase_length--) {
      chase = code_table[chase];
      output[--b] = chase & 0xff;  // Write backwards.
      chase >>= 8;  // Pull down to the prefix code.
    }

    if (prev_code !== null && next_code < 4096) {
      code_table[next_code++] = prev_code << 8 | k;
      // TODO(deanm): Figure out this clearing vs code growth logic better.  I
      // have an feeling that it should just happen somewhere else, for now it
      // is awkward between when we grow past the max and then hit a clear code.
      // For now just check if we hit the max 12-bits (then a clear code should
      // follow, also of course encoded in 12-bits).
      if (next_code >= code_mask+1 && cur_code_size < 12) {
        ++cur_code_size;
        code_mask = code_mask << 1 | 1;
      }
    }

    prev_code = code;
  }

  if (op !== output_length) {
    console.log("Warning, gif stream shorter than expected.");
  }

  return output;
}

try { exports.GifWriter = GifWriter; exports.GifReader = GifReader } catch(e) { }  // CommonJS.

exports.GifWriter = GifWriter;

}(this));


/*
* NeuQuant Neural-Net Quantization Algorithm
* ------------------------------------------
*
* Copyright (c) 1994 Anthony Dekker
*
* NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994. See
* "Kohonen neural networks for optimal colour quantization" in "Network:
* Computation in Neural Systems" Vol. 5 (1994) pp 351-367. for a discussion of
* the algorithm.
*
* Any party obtaining a copy of these files from the author, directly or
* indirectly, is granted, free of charge, a full and unrestricted irrevocable,
* world-wide, paid up, royalty-free, nonexclusive right and license to deal in
* this software and documentation files (the "Software"), including without
* limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons who
* receive copies from any such party to do so, with the only requirement being
* that this copyright notice remain intact.
*/

/*
* This class handles Neural-Net quantization algorithm
* @author Kevin Weiner (original Java version - kweiner@fmsware.com)
* @author Thibault Imbert (AS3 version - bytearray.org)
* @version 0.1 AS3 implementation
*/

//import flash.utils.ByteArray;
(function(self){

self.NeuQuant = function()
{
    var exports = {};
    /*private_static*/ var netsize/*int*/ = 256; /* number of colours used */

  /* four primes near 500 - assume no image has a length so large */
  /* that it is divisible by all four primes */

  /*private_static*/ var prime1/*int*/ = 499;
  /*private_static*/ var prime2/*int*/ = 491;
  /*private_static*/ var prime3/*int*/ = 487;
  /*private_static*/ var prime4/*int*/ = 503;
  /*private_static*/ var minpicturebytes/*int*/ = (3 * prime4);

  /* minimum size for input image */
  /*
  * Program Skeleton ---------------- [select samplefac in range 1..30] [read
  * image from input file] pic = (unsigned char*) malloc(3*width*height);
  * initnet(pic,3*width*height,samplefac); learn(); unbiasnet(); [write output
  * image header, using writecolourmap(f)] inxbuild(); write output image using
  * inxsearch(b,g,r)
  */

  /*
  * Network Definitions -------------------
  */

  /*private_static*/ var maxnetpos/*int*/ = (netsize - 1);
  /*private_static*/ var netbiasshift/*int*/ = 4; /* bias for colour values */
  /*private_static*/ var ncycles/*int*/ = 100; /* no. of learning cycles */

  /* defs for freq and bias */
  /*private_static*/ var intbiasshift/*int*/ = 16; /* bias for fractions */
  /*private_static*/ var intbias/*int*/ = (1 << intbiasshift);
  /*private_static*/ var gammashift/*int*/ = 10; /* gamma = 1024 */
  /*private_static*/ var gamma/*int*/ = (1 << gammashift);
  /*private_static*/ var betashift/*int*/ = 10;
  /*private_static*/ var beta/*int*/ = (intbias >> betashift); /* beta = 1/1024 */
  /*private_static*/ var betagamma/*int*/ = (intbias << (gammashift - betashift));

  /* defs for decreasing radius factor */
  /*private_static*/ var initrad/*int*/ = (netsize >> 3); /*
                                                         * for 256 cols, radius
                                                         * starts
                                                         */

  /*private_static*/ var radiusbiasshift/*int*/ = 6; /* at 32.0 biased by 6 bits */
  /*private_static*/ var radiusbias/*int*/ = (1 << radiusbiasshift);
  /*private_static*/ var initradius/*int*/ = (initrad * radiusbias); /*
                                                                   * and
                                                                   * decreases
                                                                   * by a
                                                                   */

  /*private_static*/ var radiusdec/*int*/ = 30; /* factor of 1/30 each cycle */

  /* defs for decreasing alpha factor */
  /*private_static*/ var alphabiasshift/*int*/ = 10; /* alpha starts at 1.0 */
  /*private_static*/ var initalpha/*int*/ = (1 << alphabiasshift);
  /*private*/ var alphadec/*int*/ /* biased by 10 bits */

  /* radbias and alpharadbias used for radpower calculation */
  /*private_static*/ var radbiasshift/*int*/ = 8;
  /*private_static*/ var radbias/*int*/ = (1 << radbiasshift);
  /*private_static*/ var alpharadbshift/*int*/ = (alphabiasshift + radbiasshift);

  /*private_static*/ var alpharadbias/*int*/ = (1 << alpharadbshift);

  /*
  * Types and Global Variables --------------------------
  */

  /*private*/ var thepicture/*ByteArray*//* the input image itself */
  /*private*/ var lengthcount/*int*/; /* lengthcount = H*W*3 */
  /*private*/ var samplefac/*int*/; /* sampling factor 1..30 */

  // typedef int pixel[4]; /* BGRc */
  /*private*/ var network/*Array*/; /* the network itself - [netsize][4] */
  /*protected*/ var netindex/*Array*/ = new Array();

  /* for network lookup - really 256 */
  /*private*/ var bias/*Array*/ = new Array();

  /* bias and freq arrays for learning */
  /*private*/ var freq/*Array*/ = new Array();
  /*private*/ var radpower/*Array*/ = new Array();

  var NeuQuant = exports.NeuQuant = function NeuQuant(thepic/*ByteArray*/, len/*int*/, sample/*int*/)
  {

    var i/*int*/;
    var p/*Array*/;

    thepicture = thepic;
    lengthcount = len;
    samplefac = sample;

    network = new Array(netsize);

    for (i = 0; i < netsize; i++)
    {

      network[i] = new Array(4);
      p = network[i];
      p[0] = p[1] = p[2] = (i << (netbiasshift + 8)) / netsize;
      freq[i] = intbias / netsize; /* 1/netsize */
      bias[i] = 0;
    }

  }

  var colorMap = function colorMap()/*ByteArray*/
  {

    var map/*ByteArray*/ = [];
      var index/*Array*/ = new Array(netsize);
      for (var i/*int*/ = 0; i < netsize; i++)
        index[network[i][3]] = i;
      var k/*int*/ = 0;
      for (var l/*int*/ = 0; l < netsize; l++) {
        var j/*int*/ = index[l];
        map[k++] = (network[j][0]);
        map[k++] = (network[j][1]);
        map[k++] = (network[j][2]);
      }
      return map;

  }

  /*
   * Insertion sort of network and building of netindex[0..255] (to do after
   * unbias)
   * -------------------------------------------------------------------------------
   */

   var inxbuild = function inxbuild()/*void*/
   {

    var i/*int*/;
    var j/*int*/;
    var smallpos/*int*/;
    var smallval/*int*/;
    var p/*Array*/;
    var q/*Array*/;
    var previouscol/*int*/
    var startpos/*int*/

    previouscol = 0;
    startpos = 0;
    for (i = 0; i < netsize; i++)
    {

      p = network[i];
      smallpos = i;
      smallval = p[1]; /* index on g */
      /* find smallest in i..netsize-1 */
      for (j = i + 1; j < netsize; j++)
      {
        q = network[j];
        if (q[1] < smallval)
        { /* index on g */

        smallpos = j;
        smallval = q[1]; /* index on g */
      }
      }

      q = network[smallpos];
      /* swap p (i) and q (smallpos) entries */

      if (i != smallpos)
      {

        j = q[0];
        q[0] = p[0];
        p[0] = j;
        j = q[1];
        q[1] = p[1];
        p[1] = j;
        j = q[2];
        q[2] = p[2];
        p[2] = j;
        j = q[3];
        q[3] = p[3];
        p[3] = j;

      }

      /* smallval entry is now in position i */

      if (smallval != previouscol)

      {

      netindex[previouscol] = (startpos + i) >> 1;

      for (j = previouscol + 1; j < smallval; j++) netindex[j] = i;

      previouscol = smallval;
      startpos = i;

      }

    }

    netindex[previouscol] = (startpos + maxnetpos) >> 1;
    for (j = previouscol + 1; j < 256; j++) netindex[j] = maxnetpos; /* really 256 */

   }

   /*
   * Main Learning Loop ------------------
   */

   var learn = function learn()/*void*/

   {

     var i/*int*/;
     var j/*int*/;
     var b/*int*/;
     var g/*int*/
     var r/*int*/;
     var radius/*int*/;
     var rad/*int*/;
     var alpha/*int*/;
     var step/*int*/;
     var delta/*int*/;
     var samplepixels/*int*/;
     var p/*ByteArray*/;
     var pix/*int*/;
     var lim/*int*/;

     if (lengthcount < minpicturebytes) samplefac = 1;

     alphadec = 30 + ((samplefac - 1) / 3);
     p = thepicture;
     pix = 0;
     lim = lengthcount;
     samplepixels = lengthcount / (3 * samplefac);
     delta = (samplepixels / ncycles) | 0;
     alpha = initalpha;
     radius = initradius;

     rad = radius >> radiusbiasshift;
     if (rad <= 1) rad = 0;

     for (i = 0; i < rad; i++) radpower[i] = alpha * (((rad * rad - i * i) * radbias) / (rad * rad));


     if (lengthcount < minpicturebytes) step = 3;

     else if ((lengthcount % prime1) != 0) step = 3 * prime1;

     else

     {

       if ((lengthcount % prime2) != 0) step = 3 * prime2;

       else

       {

         if ((lengthcount % prime3) != 0) step = 3 * prime3;

         else step = 3 * prime4;

       }

     }

     i = 0;

     while (i < samplepixels)

     {

       b = (p[pix + 0] & 0xff) << netbiasshift;
       g = (p[pix + 1] & 0xff) << netbiasshift;
       r = (p[pix + 2] & 0xff) << netbiasshift;
       j = contest(b, g, r);

       altersingle(alpha, j, b, g, r);

       if (rad != 0) alterneigh(rad, j, b, g, r); /* alter neighbours */

       pix += step;

       if (pix >= lim) pix -= lengthcount;

       i++;

       if (delta == 0) delta = 1;

       if (i % delta == 0)

       {

         alpha -= alpha / alphadec;
         radius -= radius / radiusdec;
         rad = radius >> radiusbiasshift;

         if (rad <= 1) rad = 0;

         for (j = 0; j < rad; j++) radpower[j] = alpha * (((rad * rad - j * j) * radbias) / (rad * rad));

       }

     }

   }

   /*
   ** Search for BGR values 0..255 (after net is unbiased) and return colour
   * index
   * ----------------------------------------------------------------------------
   */

   var map = exports.map = function map(b/*int*/, g/*int*/, r/*int*/)/*int*/

   {

     var i/*int*/;
     var j/*int*/;
     var dist/*int*/
     var a/*int*/;
     var bestd/*int*/;
     var p/*Array*/;
     var best/*int*/;

     bestd = 1000; /* biggest possible dist is 256*3 */
     best = -1;
     i = netindex[g]; /* index on g */
     j = i - 1; /* start at netindex[g] and work outwards */

    while ((i < netsize) || (j >= 0))

  {

    if (i < netsize)

    {

      p = network[i];

      dist = p[1] - g; /* inx key */

      if (dist >= bestd) i = netsize; /* stop iter */

      else

      {

        i++;

        if (dist < 0) dist = -dist;

        a = p[0] - b;

        if (a < 0) a = -a;

        dist += a;

        if (dist < bestd)

        {

          a = p[2] - r;

          if (a < 0) a = -a;

          dist += a;

          if (dist < bestd)

          {

            bestd = dist;
            best = p[3];

          }

        }

      }

    }

      if (j >= 0)
    {

      p = network[j];

      dist = g - p[1]; /* inx key - reverse dif */

      if (dist >= bestd) j = -1; /* stop iter */

      else
      {

        j--;
        if (dist < 0) dist = -dist;
        a = p[0] - b;
        if (a < 0) a = -a;
        dist += a;

        if (dist < bestd)

        {

          a = p[2] - r;
          if (a < 0)a = -a;
          dist += a;
          if (dist < bestd)
          {
            bestd = dist;
            best = p[3];
          }

        }

      }

    }

  }

    return (best);

  }

  var process = exports.process = function process()/*ByteArray*/
  {

    learn();
    unbiasnet();
    inxbuild();
    return colorMap();

  }

  /*
  * Unbias network to give byte values 0..255 and record position i to prepare
  * for sort
  * -----------------------------------------------------------------------------------
  */

  var unbiasnet = function unbiasnet()/*void*/

  {

    var i/*int*/;
    var j/*int*/;

    for (i = 0; i < netsize; i++)
  {
      network[i][0] >>= netbiasshift;
      network[i][1] >>= netbiasshift;
      network[i][2] >>= netbiasshift;
      network[i][3] = i; /* record colour no */
    }

  }

  /*
  * Move adjacent neurons by precomputed alpha*(1-((i-j)^2/[r]^2)) in
  * radpower[|i-j|]
  * ---------------------------------------------------------------------------------
  */

  var alterneigh = function alterneigh(rad/*int*/, i/*int*/, b/*int*/, g/*int*/, r/*int*/)/*void*/

  {

    var j/*int*/;
    var k/*int*/;
    var lo/*int*/;
    var hi/*int*/;
    var a/*int*/;
    var m/*int*/;

    var p/*Array*/;

    lo = i - rad;
    if (lo < -1) lo = -1;

    hi = i + rad;

    if (hi > netsize) hi = netsize;

    j = i + 1;
    k = i - 1;
    m = 1;

    while ((j < hi) || (k > lo))

    {

      a = radpower[m++];

      if (j < hi)

      {

        p = network[j++];

        try {

          p[0] -= (a * (p[0] - b)) / alpharadbias;
          p[1] -= (a * (p[1] - g)) / alpharadbias;
          p[2] -= (a * (p[2] - r)) / alpharadbias;

          } catch (e/*Error*/) {} // prevents 1.3 miscompilation

      }

      if (k > lo)

      {

        p = network[k--];

        try
        {

          p[0] -= (a * (p[0] - b)) / alpharadbias;
          p[1] -= (a * (p[1] - g)) / alpharadbias;
          p[2] -= (a * (p[2] - r)) / alpharadbias;

        } catch (e/*Error*/) {}

      }

    }

  }

  /*
  * Move neuron i towards biased (b,g,r) by factor alpha
  * ----------------------------------------------------
  */

  var altersingle = function altersingle(alpha/*int*/, i/*int*/, b/*int*/, g/*int*/, r/*int*/)/*void*/
  {

    /* alter hit neuron */
    var n/*Array*/ = network[i];
    n[0] -= (alpha * (n[0] - b)) / initalpha;
    n[1] -= (alpha * (n[1] - g)) / initalpha;
    n[2] -= (alpha * (n[2] - r)) / initalpha;

  }

  /*
  * Search for biased BGR values ----------------------------
  */

  var contest = function contest(b/*int*/, g/*int*/, r/*int*/)/*int*/
  {

    /* finds closest neuron (min dist) and updates freq */
    /* finds best neuron (min dist-bias) and returns position */
    /* for frequently chosen neurons, freq[i] is high and bias[i] is negative */
    /* bias[i] = gamma*((1/netsize)-freq[i]) */

    var i/*int*/;
    var dist/*int*/;
    var a/*int*/;
    var biasdist/*int*/;
    var betafreq/*int*/;
    var bestpos/*int*/;
    var bestbiaspos/*int*/;
    var bestd/*int*/;
    var bestbiasd/*int*/;
    var n/*Array*/;

    bestd = ~(1 << 31);
    bestbiasd = bestd;
    bestpos = -1;
    bestbiaspos = bestpos;

    for (i = 0; i < netsize; i++)

    {

      n = network[i];
      dist = n[0] - b;

      if (dist < 0) dist = -dist;

      a = n[1] - g;

      if (a < 0) a = -a;

      dist += a;

      a = n[2] - r;

      if (a < 0) a = -a;

      dist += a;

      if (dist < bestd)

      {

        bestd = dist;
        bestpos = i;

      }

      biasdist = dist - ((bias[i]) >> (intbiasshift - netbiasshift));

      if (biasdist < bestbiasd)

      {

        bestbiasd = biasdist;
        bestbiaspos = i;

      }

      betafreq = (freq[i] >> betashift);
      freq[i] -= betafreq;
      bias[i] += (betafreq << gammashift);

    }

    freq[bestpos] += beta;
    bias[bestpos] -= betagamma;
    return (bestbiaspos);

  }

  NeuQuant.apply(this, arguments);
  return exports;
};
}(this));



/*
 * Copyright (c) 2010 Nick Galbreath
 * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

(function(self){
  var thereAreTransparentPixels = false;

  var rgba2rgb = function (data, matte, transparent) {
    var pixels = [];
    var count = 0;
    var len = data.length;
    for ( var i=0; i<len; i+=4 ) {
      var r = data[i];
      var g = data[i+1];
      var b = data[i+2];
      var a = data[i+3];
      if (transparent && a===0) {
        // Use transparent color
        r = transparent[0];
        g = transparent[1];
        b = transparent[2];
        thereAreTransparentPixels = true;
      } else if (matte && a<255) {
        // Use matte with "over" blend mode
        r = ( (r*a + (matte[0] * (255-a))) / 255 ) |0;
        g = ( (g*a + (matte[1] * (255-a))) / 255 ) |0;
        b = ( (b*a + (matte[2] * (255-a))) / 255 ) |0;
      }
      pixels[count++] = r;
      pixels[count++] = g;
      pixels[count++] = b;
    }
    return pixels;
  };

  var rgb2num = function(palette) {
    var colors = [];
    var count = 0;
    var len = palette.length;
    for ( var i=0; i<len; i+=3 ) {
      colors[count++] = palette[i+2] | (palette[i+1] << 8) | (palette[i] << 16);
    }
    return colors;
  };

  self.onmessage = function(event) {
    var frames = event.data.frames;
    var framesLength = frames.length;
    var delay = event.data.delay / 10;

    var matte = event.data.matte ? event.data.matte : [255,255,255];
    var transparent = event.data.transparent ? event.data.transparent : false;

    var startTime = Date.now();

    var buffer = new Uint8Array( new ArrayBuffer(frames[0].width * frames[0].height * framesLength * 5) );
    //var buffer = new Uint8Array( frames[0].width * frames[0].height * framesLength * 5 );
    var gif = new GifWriter( buffer, frames[0].width, frames[0].height, { loop: 0 } );
    // var pixels = new Uint8Array( frames[0].width * frames[0].height );

    var addFrame = function (frame) {
      var data = frame.data;

      // Make palette with NeuQuant.js
      var nqInPixels = rgba2rgb(data, matte, transparent);
      var len = nqInPixels.length;
      var nPix = len / 3;
      var map = [];
      var nq = new NeuQuant(nqInPixels, len, 10);
      // initialize quantizer
      var paletteRGB = nq.process(); // create reduced palette
      var palette = rgb2num(paletteRGB);
      // map image pixels to new palette
      var k = 0;
      for (var j = 0; j < nPix; j++) {
        var index = nq.map(nqInPixels[k++] & 0xff, nqInPixels[k++] & 0xff, nqInPixels[k++] & 0xff);
        // usedEntry[index] = true;
        map[j] = index;
      }

      var options = { palette: new Uint32Array( palette ), delay: delay };

      if (thereAreTransparentPixels) {
        options.transparent = nq.map(transparent[0], transparent[1], transparent[2]);
        options.disposal = 2; // Clear between frames
      }

      gif.addFrame( 0, 0, frame.width, frame.height, new Uint8Array( map ), options );
    };

    var i;
    // Add all frames
    for (i = 0; i<framesLength; i++) {
      addFrame( frames[i] );
      self.postMessage({
        type: 'progress',
        data: (i+1)/framesLength
      });
    }

    // Finish
    var gifString = '';
    var l = gif.end();
    for (i = 0; i < l; i++) {
      gifString += String.fromCharCode( buffer[ i ] );
    }

    //
    var getGifBuffer = function(gif,buffer) {
      var l = gif.end();
      var uInt8View = new Uint8Array(new ArrayBuffer( l ));
      //var viewLength = uInt8View.length;
      var i;
      for (i = 0; i < l; i++) {
        uInt8View[i] = buffer[i];
      }
      return uInt8View;
    };

    var gifBuffer = getGifBuffer(gif,buffer);

    //window.aasdasdasd();
    self.postMessage({
      type: 'gif',
      buffer: gifBuffer,
      data: gifString,
      dataURL: 'data:image/gif;base64,'+base64.encode(gifString),
      frameCount: framesLength,
      encodeTime: Date.now()-startTime
    });

    // Terminate self
    self.close();
  };
 }(this));
