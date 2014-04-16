//https://github.com/tparisi/WebGLBook/blob/master/Chapter%203/graphics-solar-system.html
//http://stackoverflow.com/questions/8088475/how-to-customise-file-type-to-syntax-associations-in-sublime-2
uniform sampler2D baseTexture;
uniform float baseSpeed;

uniform sampler2D noiseTexture;
uniform float noiseScale;
uniform float alpha;
uniform float time;

varying vec2 vUv;
void main()
{


    vec4 noiseColor = texture2D( noiseTexture , vUv );
    vec4 baseColor = texture2D( baseTexture , vUv );

    vec2 noiseCoord = vUv + vec2( 2, 4 ) * 0.1 * time  * baseSpeed;
    noiseCoord.x += noiseColor.g * 0.2;
    noiseCoord.y -= noiseColor.r * 0.3;

    vec2 noiseCoord2 = vUv + vec2( 1, 0 ) * 0.1 * time  * baseSpeed;
    noiseCoord2.x -= noiseColor.r * 4.0;
    noiseCoord2.y += noiseColor.g * 1.5;


    vec2 uvNoiseTimeShift = 		vUv
								+

									noiseScale
                                *   noiseCoord2
                                ;

    float fog = texture2D( noiseTexture, noiseCoord2 * 3.0 ).a * 0.5 ;

	vec4 tempColor = texture2D(
								baseTexture,
								uvNoiseTimeShift
							);
    tempColor.a = alpha;



    tempColor += tempColor * 0.45;

    tempColor -= vec4 (fog) / 0.6;

	gl_FragColor = tempColor;
}