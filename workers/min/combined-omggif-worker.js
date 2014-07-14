!function(a){base64={},base64.PADCHAR="=",base64.ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",base64.getbyte64=function(a,b){var c=base64.ALPHA.indexOf(a.charAt(b));if(-1==c)throw"Cannot decode base64";return c},base64.decode=function(a){a=""+a;var b,c,d,e=base64.getbyte64,f=a.length;if(0==f)return a;if(f%4!=0)throw"Cannot decode base64";b=0,a.charAt(f-1)==base64.PADCHAR&&(b=1,a.charAt(f-2)==base64.PADCHAR&&(b=2),f-=4);var g=[];for(c=0;f>c;c+=4)d=e(a,c)<<18|e(a,c+1)<<12|e(a,c+2)<<6|e(a,c+3),g.push(String.fromCharCode(d>>16,d>>8&255,255&d));switch(b){case 1:d=e(a,c)<<18|e(a,c+1)<<12|e(a,c+2)<<6,g.push(String.fromCharCode(d>>16,d>>8&255));break;case 2:d=e(a,c)<<18|e(a,c+1)<<12,g.push(String.fromCharCode(d>>16))}return g.join("")},base64.getbyte=function(a,b){var c=a.charCodeAt(b);if(c>255)throw"INVALID_CHARACTER_ERR: DOM Exception 5";return c},base64.encode=function(a){if(1!=arguments.length)throw"SyntaxError: Not enough arguments";var b,c,d=base64.PADCHAR,e=base64.ALPHA,f=base64.getbyte,g=[];a=""+a;var h=a.length-a.length%3;if(0==a.length)return a;for(b=0;h>b;b+=3)c=f(a,b)<<16|f(a,b+1)<<8|f(a,b+2),g.push(e.charAt(c>>18)),g.push(e.charAt(c>>12&63)),g.push(e.charAt(c>>6&63)),g.push(e.charAt(63&c));switch(a.length-h){case 1:c=f(a,b)<<16,g.push(e.charAt(c>>18)+e.charAt(c>>12&63)+d+d);break;case 2:c=f(a,b)<<16|f(a,b+1)<<8,g.push(e.charAt(c>>18)+e.charAt(c>>12&63)+e.charAt(c>>6&63)+d)}return g.join("")},a.base64=base64}(this),function(a){function b(a,b,d,e){function f(a){var b=a.length;if(2>b||b>256||b&b-1)throw"Invalid code/color length ("+b+"), must be power of 2 and 2 .. 256.";return b}var g=0,e=void 0===e?{}:e,h=void 0===e.loop?null:e.loop,i=void 0===e.palette?null:e.palette;if(0>=b||0>=d||b>65535||d>65535)throw"Width/Height invalid.";a[g++]=71,a[g++]=73,a[g++]=70,a[g++]=56,a[g++]=57,a[g++]=97;var j=0,k=0;if(null!==i){for(var l=f(i);l>>=1;)++j;if(l=1<<j,--j,void 0!==e.background){if(k=e.background,k>=l)throw"Background index out of range.";if(0===k)throw"Background index explicitly passed as 0."}}if(a[g++]=255&b,a[g++]=b>>8&255,a[g++]=255&d,a[g++]=d>>8&255,a[g++]=(null!==i?128:0)|j,a[g++]=k,a[g++]=0,null!==i)for(var m=0,n=i.length;n>m;++m){var o=i[m];a[g++]=o>>16&255,a[g++]=o>>8&255,a[g++]=255&o}if(null!==h){if(0>h||h>65535)throw"Loop count invalid.";a[g++]=33,a[g++]=255,a[g++]=11,a[g++]=78,a[g++]=69,a[g++]=84,a[g++]=83,a[g++]=67,a[g++]=65,a[g++]=80,a[g++]=69,a[g++]=50,a[g++]=46,a[g++]=48,a[g++]=3,a[g++]=1,a[g++]=255&h,a[g++]=h>>8&255,a[g++]=0}var p=!1;this.addFrame=function(b,d,e,h,j,k){if(p===!0&&(--g,p=!1),k=void 0===k?{}:k,0>b||0>d||b>65535||d>65535)throw"x/y invalid.";if(0>=e||0>=h||e>65535||h>65535)throw"Width/Height invalid.";if(j.length<e*h)throw"Not enough pixels for the frame size.";var l=!0,m=k.palette;if((void 0===m||null===m)&&(l=!1,m=i),void 0===m||null===m)throw"Must supply either a local or global palette.";for(var n=f(m),o=0;n>>=1;)++o;n=1<<o;var q=void 0===k.delay?0:k.delay,r=void 0===k.disposal?0:k.disposal;if(0>r||r>3)throw"Disposal out of range.";var s=!1,t=0;if(void 0!==k.transparent&&null!==k.transparent&&(s=!0,t=k.transparent,0>t||t>=n))throw"Transparent color index.";if((0!==r||s||0!==q)&&(a[g++]=33,a[g++]=249,a[g++]=4,a[g++]=r<<2|(s===!0?1:0),a[g++]=255&q,a[g++]=q>>8&255,a[g++]=t,a[g++]=0),a[g++]=44,a[g++]=255&b,a[g++]=b>>8&255,a[g++]=255&d,a[g++]=d>>8&255,a[g++]=255&e,a[g++]=e>>8&255,a[g++]=255&h,a[g++]=h>>8&255,a[g++]=l===!0?128|o-1:0,l===!0)for(var u=0,v=m.length;v>u;++u){var w=m[u];a[g++]=w>>16&255,a[g++]=w>>8&255,a[g++]=255&w}g=c(a,g,2>o?2:o,j)},this.end=function(){return p===!1&&(a[g++]=59,p=!0),g}}function c(a,b,c,d){function e(c){for(;m>=c;)a[b++]=255&n,n>>=8,m-=8,b===g+256&&(a[g]=255,g=b++)}function f(a){n|=a<<m,m+=l,e(8)}a[b++]=c;var g=b++,h=1<<c,i=h-1,j=h+1,k=j+1,l=c+1,m=0,n=0,o=d[0]&i,p={};f(h);for(var q=1,r=d.length;r>q;++q){var s=d[q]&i,t=o<<8|s,u=p[t];if(void 0===u){for(n|=o<<m,m+=l;m>=8;)a[b++]=255&n,n>>=8,m-=8,b===g+256&&(a[g]=255,g=b++);4096===k?(f(h),k=j+1,l=c+1,p={}):(k>=1<<l&&++l,p[t]=k++),o=s}else o=u}return f(o),f(j),e(1),g+1===b?a[g]=0:(a[g]=b-g-1,a[b++]=0),b}function d(a){var b=0;if(71!==a[b++]||73!==a[b++]||70!==a[b++]||56!==a[b++]||57!==a[b++]||97!==a[b++])throw"Invalid GIF 89a header.";{var c=a[b++]|a[b++]<<8,d=a[b++]|a[b++]<<8,f=a[b++],g=f>>7,h=7&f,i=1<<h+1;a[b++]}a[b++];var j=null;g&&(j=b,b+=3*i);var k=null,l=!0,m=[],n=0,o=null,p=0,k=null;for(this.width=c,this.height=d;l&&b<a.length;)switch(a[b++]){case 33:switch(a[b++]){case 255:if(11!==a[b]||78==a[b+1]&&69==a[b+2]&&84==a[b+3]&&83==a[b+4]&&67==a[b+5]&&65==a[b+6]&&80==a[b+7]&&69==a[b+8]&&50==a[b+9]&&46==a[b+10]&&48==a[b+11]&&3==a[b+12]&&1==a[b+13]&&0==a[b+16])b+=14,k=a[b++]|a[b++]<<8,b++;else for(b+=12;;){var q=a[b++];if(0===q)break;b+=q}break;case 249:if(4!==a[b++]||0!==a[b+4])throw"Invalid graphics extension block.";var r=a[b++];n=a[b++]|a[b++]<<8,o=a[b++],0===(1&r)&&(o=null),p=r>>2&7,b++;break;case 254:for(;;){var q=a[b++];if(0===q)break;b+=q}break;default:throw"Unknown graphic control label: 0x"+a[b-1].toString(16)}break;case 44:var s=a[b++]|a[b++]<<8,t=a[b++]|a[b++]<<8,u=a[b++]|a[b++]<<8,v=a[b++]|a[b++]<<8,w=a[b++],x=w>>7,y=7&w,z=1<<y+1,A=j,B=!1;if(x){var B=!0;A=b,b+=3*z}var C=b;for(b++;;){var q=a[b++];if(0===q)break;b+=q}m.push({x:s,y:t,width:u,height:v,has_local_palette:B,palette_offset:A,data_offset:C,data_length:b-C,transparent_index:o,delay:n,disposal:p});break;case 59:l=!1;break;default:throw"Unknown gif block: 0x"+a[b-1].toString(16)}this.numFrames=function(){return m.length},this.frameInfo=function(a){if(0>a||a>=m.length)throw"Frame index out of range.";return m[a]},this.decodeAndBlitFrameBGRA=function(b,d){var f=this.frameInfo(b),g=f.width*f.height,h=new Uint8Array(g);e(a,f.data_offset,h,g);var i=f.palette_offset,j=f.transparent_index;null===j&&(j=256);for(var k=4*(c-f.width),l=4*(f.y*c+f.x),m=f.width,n=0,o=h.length;o>n;++n){var p=h[n];if(p===j)l+=4;else{var q=a[i+3*p],r=a[i+3*p+1],s=a[i+3*p+2];d[l++]=s,d[l++]=r,d[l++]=q,d[l++]=255}0===--m&&(l+=k,m=f.width)}},this.decodeAndBlitFrameRGBA=function(b,d){var f=this.frameInfo(b),g=f.width*f.height,h=new Uint8Array(g);e(a,f.data_offset,h,g);var i=0,j=f.palette_offset,k=f.transparent_index;null===k&&(k=256);for(var l=4*(c-f.width),i=4*(f.y*c+f.x),m=f.width,n=0,o=h.length;o>n;++n){var p=h[n];if(p===k)i+=4;else{var q=a[j+3*p],r=a[j+3*p+1],s=a[j+3*p+2];d[i++]=q,d[i++]=r,d[i++]=s,d[i++]=255}0===--m&&(i+=l,m=f.width)}}}function e(a,b,c,d){for(var e=a[b++],f=1<<e,g=f+1,h=g+1,i=e+1,j=(1<<i)-1,k=0,l=0,m=0,n=a[b++],o=new Int32Array(4096),p=null;;){for(;16>k&&0!==n;)l|=a[b++]<<k,k+=8,1===n?n=a[b++]:--n;if(i>k)break;var q=l&j;if(l>>=i,k-=i,q!==f){if(q===g)break;for(var r=h>q?q:p,s=0,t=r;t>f;)t=o[t]>>8,++s;var u=t,v=m+s+(r!==q?1:0);if(v>d)return void console.log("Warning, gif stream longer than expected.");c[m++]=u,m+=s;var w=m;for(r!==q&&(c[m++]=u),t=r;s--;)t=o[t],c[--w]=255&t,t>>=8;null!==p&&4096>h&&(o[h++]=p<<8|u,h>=j+1&&12>i&&(++i,j=j<<1|1)),p=q}else h=g+1,i=e+1,j=(1<<i)-1,p=null}return m!==d&&console.log("Warning, gif stream shorter than expected."),c}try{a.GifWriter=b,a.GifReader=d}catch(f){}a.GifWriter=b}(this),function(a){a.NeuQuant=function(){var a,b,c,d,e,f={},g=256,h=499,i=491,j=487,k=503,l=3*k,m=g-1,n=4,o=100,p=16,q=1<<p,r=10,s=10,t=q>>s,u=q<<r-s,v=g>>3,w=6,x=1<<w,y=v*x,z=30,A=10,B=1<<A,C=8,D=1<<C,E=A+C,F=1<<E,G=new Array,H=new Array,I=new Array,J=new Array,K=f.NeuQuant=function(a,f,h){var i,j;for(b=a,c=f,d=h,e=new Array(g),i=0;g>i;i++)e[i]=new Array(4),j=e[i],j[0]=j[1]=j[2]=(i<<n+8)/g,I[i]=q/g,H[i]=0},L=function(){for(var a=[],b=new Array(g),c=0;g>c;c++)b[e[c][3]]=c;for(var d=0,f=0;g>f;f++){var h=b[f];a[d++]=e[h][0],a[d++]=e[h][1],a[d++]=e[h][2]}return a},M=function(){var a,b,c,d,f,h,i,j;for(i=0,j=0,a=0;g>a;a++){for(f=e[a],c=a,d=f[1],b=a+1;g>b;b++)h=e[b],h[1]<d&&(c=b,d=h[1]);if(h=e[c],a!=c&&(b=h[0],h[0]=f[0],f[0]=b,b=h[1],h[1]=f[1],f[1]=b,b=h[2],h[2]=f[2],f[2]=b,b=h[3],h[3]=f[3],f[3]=b),d!=i){for(G[i]=j+a>>1,b=i+1;d>b;b++)G[b]=a;i=d,j=a}}for(G[i]=j+m>>1,b=i+1;256>b;b++)G[b]=m},N=function(){var e,f,g,m,p,q,r,s,t,u,v,x,A,C;for(l>c&&(d=1),a=30+(d-1)/3,x=b,A=0,C=c,v=c/(3*d),u=v/o|0,s=B,q=y,r=q>>w,1>=r&&(r=0),e=0;r>e;e++)J[e]=s*((r*r-e*e)*D/(r*r));for(t=l>c?3:c%h!=0?3*h:c%i!=0?3*i:c%j!=0?3*j:3*k,e=0;v>e;)if(g=(255&x[A+0])<<n,m=(255&x[A+1])<<n,p=(255&x[A+2])<<n,f=R(g,m,p),Q(s,f,g,m,p),0!=r&&P(r,f,g,m,p),A+=t,A>=C&&(A-=c),e++,0==u&&(u=1),e%u==0)for(s-=s/a,q-=q/z,r=q>>w,1>=r&&(r=0),f=0;r>f;f++)J[f]=s*((r*r-f*f)*D/(r*r))},O=(f.map=function(a,b,c){var d,f,h,i,j,k,l;for(j=1e3,l=-1,d=G[b],f=d-1;g>d||f>=0;)g>d&&(k=e[d],h=k[1]-b,h>=j?d=g:(d++,0>h&&(h=-h),i=k[0]-a,0>i&&(i=-i),h+=i,j>h&&(i=k[2]-c,0>i&&(i=-i),h+=i,j>h&&(j=h,l=k[3])))),f>=0&&(k=e[f],h=b-k[1],h>=j?f=-1:(f--,0>h&&(h=-h),i=k[0]-a,0>i&&(i=-i),h+=i,j>h&&(i=k[2]-c,0>i&&(i=-i),h+=i,j>h&&(j=h,l=k[3]))));return l},f.process=function(){return N(),O(),M(),L()},function(){var a;for(a=0;g>a;a++)e[a][0]>>=n,e[a][1]>>=n,e[a][2]>>=n,e[a][3]=a}),P=function(a,b,c,d,f){var h,i,j,k,l,m,n;for(j=b-a,-1>j&&(j=-1),k=b+a,k>g&&(k=g),h=b+1,i=b-1,m=1;k>h||i>j;){if(l=J[m++],k>h){n=e[h++];try{n[0]-=l*(n[0]-c)/F,n[1]-=l*(n[1]-d)/F,n[2]-=l*(n[2]-f)/F}catch(o){}}if(i>j){n=e[i--];try{n[0]-=l*(n[0]-c)/F,n[1]-=l*(n[1]-d)/F,n[2]-=l*(n[2]-f)/F}catch(o){}}}},Q=function(a,b,c,d,f){var g=e[b];g[0]-=a*(g[0]-c)/B,g[1]-=a*(g[1]-d)/B,g[2]-=a*(g[2]-f)/B},R=function(a,b,c){var d,f,h,i,j,k,l,m,o,q;for(m=~(1<<31),o=m,k=-1,l=k,d=0;g>d;d++)q=e[d],f=q[0]-a,0>f&&(f=-f),h=q[1]-b,0>h&&(h=-h),f+=h,h=q[2]-c,0>h&&(h=-h),f+=h,m>f&&(m=f,k=d),i=f-(H[d]>>p-n),o>i&&(o=i,l=d),j=I[d]>>s,I[d]-=j,H[d]+=j<<r;return I[k]+=t,H[k]-=u,l};return K.apply(this,arguments),f}}(this),function(a){var b=!1,c=function(a,c,d){for(var e=[],f=0,g=a.length,h=0;g>h;h+=4){var i=a[h],j=a[h+1],k=a[h+2],l=a[h+3];d&&0===l?(i=d[0],j=d[1],k=d[2],b=!0):c&&255>l&&(i=(i*l+c[0]*(255-l))/255|0,j=(j*l+c[1]*(255-l))/255|0,k=(k*l+c[2]*(255-l))/255|0),e[f++]=i,e[f++]=j,e[f++]=k}return e},d=function(a){for(var b=[],c=0,d=a.length,e=0;d>e;e+=3)b[c++]=a[e+2]|a[e+1]<<8|a[e]<<16;return b};a.onmessage=function(e){var f,g=e.data.frames,h=g.length,i=e.data.delay/10,j=e.data.matte?e.data.matte:[255,255,255],k=e.data.transparent?e.data.transparent:!1,l=Date.now(),m=new Uint8Array(new ArrayBuffer(g[0].width*g[0].height*h*5)),n=new GifWriter(m,g[0].width,g[0].height,{loop:0}),o=function(a){for(var e=a.data,f=c(e,j,k),g=f.length,h=g/3,l=[],m=new NeuQuant(f,g,10),o=m.process(),p=d(o),q=0,r=0;h>r;r++){var s=m.map(255&f[q++],255&f[q++],255&f[q++]);l[r]=s}var t={palette:new Uint32Array(p),delay:i};b&&(t.transparent=m.map(k[0],k[1],k[2]),t.disposal=2),n.addFrame(0,0,a.width,a.height,new Uint8Array(l),t)};for(f=0;h>f;f++)o(g[f]),a.postMessage({type:"progress",data:(f+1)/h});var p="",q=n.end();for(f=0;q>f;f++)p+=String.fromCharCode(m[f]);var r=function(a,b){var c,d=a.end(),e=new Uint8Array(new ArrayBuffer(d));for(c=0;d>c;c++)e[c]=b[c];return e},s=r(n,m);a.postMessage({type:"gif",buffer:s,data:p,dataURL:"data:image/gif;base64,"+base64.encode(p),frameCount:h,encodeTime:Date.now()-l}),a.close()}}(this);