precision highp float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform float time;
uniform float animationDirection;
uniform float animationSpeed;
uniform float sliceAmount;
uniform float timeOffset;
uniform float ease;
uniform int randomDirection;
uniform int randomTime;
uniform float repeatX;
uniform float repeatY;
uniform float randomSeed;

float easeInOut(float x) {
    return x < 0.5 ? pow(2.0, ease - 1.0) * pow(x, ease) : 1.0 - pow(-2.0 * x + 2.0, ease) * 0.5;
}

// PRNG that uses tile indices based on UV coordinates
float prng(vec2 seed) {
    return fract(sin(dot(seed + randomSeed, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    // Adjust UV coordinates for repeating
    vec2 uv = mod(vTexCoord * vec2(repeatX, repeatY), 1.0);
    // Calculate tile indices
    vec2 tileIndex = floor(vTexCoord * vec2(repeatX, repeatY));

    // Generate random values based on tile index
    float randVal = prng(tileIndex);
    float localDirection = (randomDirection == 1 && repeatX > 1.0 && repeatY > 1.0) ? step(0.5, randVal) : animationDirection;
    float timeOffsetRand = randomTime == 1 ? randVal * 10.0 : 0.0;

    float rawDisplacement = texture2D(uDisplacement, uv).r;
    float quantizedStep = floor(rawDisplacement * sliceAmount) / (sliceAmount - 1.0);
    float displacementValue = quantizedStep;

    float localTime = time * animationSpeed + displacementValue * timeOffset + timeOffsetRand;
    float localProgress = mod(localTime, 1.0);
    float slicePhase = easeInOut(localProgress);

    if (localDirection > 0.5) {
        // Top-to-bottom animation
        float growingV = uv.y / slicePhase;
        float shrinkingV = (uv.y - slicePhase) / (1.0 - slicePhase);
        float finalV = mix(shrinkingV, growingV, step(uv.y, slicePhase));
        gl_FragColor = texture2D(uTexture, vec2(uv.x, finalV));
    } else {
        // Left-to-right animation
        float growingU = uv.x / slicePhase;
        float shrinkingU = (uv.x - slicePhase) / (1.0 - slicePhase);
        float finalU = mix(shrinkingU, growingU, step(uv.x, slicePhase));
        gl_FragColor = texture2D(uTexture, vec2(finalU, uv.y));
    }
}