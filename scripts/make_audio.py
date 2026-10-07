"""Synthesises the full 15s soundtrack (music + SFX) for the AiA launch video.
Every event is placed by video frame (30fps) so cuts land exactly on hits.
120 BPM -> 1 beat = 15 frames. Drop lands at frame 120 (4.0s), a bar downbeat."""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 48000
DUR = 15.0
N = int(SR * DUR)
FPS = 30
rng = np.random.default_rng(7)

music = np.zeros(N)
sfx = np.zeros(N)
verb_send = np.zeros(N)
sidechain = np.ones(N)


def f2s(frame):
    return int(frame / FPS * SR)


def sec(s):
    return int(s * SR)


def t_arr(dur):
    return np.arange(int(dur * SR)) / SR


def place(buf, sig, start, gain=1.0):
    if start >= N:
        return
    end = min(N, start + len(sig))
    buf[start:end] += sig[: end - start] * gain


def bp(sig, lo, hi, order=2):
    sos = butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return sosfilt(sos, sig)


def hp(sig, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), sig)


def lp(sig, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), sig)


def noise(dur):
    return rng.uniform(-1, 1, int(dur * SR))


# ---------- instruments ----------
def kick(big=False):
    d = 0.9 if big else 0.38
    t = t_arr(d)
    f = 45 + 140 * np.exp(-t / (0.06 if big else 0.035))
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / (0.35 if big else 0.13))
    click = hp(noise(0.006), 3000) * 0.5
    out = body.copy()
    out[: len(click)] += click
    return np.tanh(out * 1.6)


def clap():
    d = 0.22
    out = np.zeros(int(d * SR))
    for off in (0.0, 0.009, 0.018):
        o = int(off * SR)
        L = len(out) - o
        n = bp(rng.uniform(-1, 1, L), 900, 3800) * np.exp(-np.arange(L) / SR / 0.05)
        out[o:] += n
    return out * 0.8


def hat(open_=False):
    d = 0.18 if open_ else 0.045
    return hp(noise(d), 7000) * np.exp(-t_arr(d) / (0.06 if open_ else 0.012))


def saw(freq, dur, detune=0.0):
    t = t_arr(dur)
    ph = (t * freq * (1 + detune)) % 1.0
    return 2 * ph - 1


def adsr(dur, a=0.005, d=0.1, s=0.6, r=0.05):
    n = int(dur * SR)
    env = np.ones(n) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    env[:na] = np.linspace(0, 1, na)
    env[na:na + nd] = np.linspace(1, s, nd)
    if nr:
        env[-nr:] *= np.linspace(1, 0, nr)
    return env


def note(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------- SFX ----------
def whoosh(dur=0.35, lo=400, hi=6000, up=True):
    n = noise(dur)
    blocks = 64
    out = np.zeros_like(n)
    L = len(n) // blocks
    for i in range(blocks):
        p = i / (blocks - 1)
        c = lo * (hi / lo) ** (p if up else 1 - p)
        seg = n[i * L:(i + 1) * L]
        out[i * L:(i + 1) * L] = bp(seg, max(60, c * 0.6), min(SR / 2 - 100, c * 1.6))
    env = np.sin(np.linspace(0, np.pi, len(out))) ** 2
    return out * env


def riser(dur):
    t = t_arr(dur)
    n = noise(dur)
    blocks = 96
    out = np.zeros_like(n)
    L = len(n) // blocks
    for i in range(blocks):
        p = i / (blocks - 1)
        c = 300 * (30 ** p)
        out[i * L:(i + 1) * L] = bp(n[i * L:(i + 1) * L], c * 0.5, min(SR / 2 - 100, c * 1.8))
    out *= (t / dur) ** 1.6
    f = 160 * (8 ** (t / dur))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / dur) ** 2 * 0.5
    return out * 1.4 + tone


def impact():
    k = kick(True)
    t = t_arr(1.6)
    sub = np.sin(2 * np.pi * 38 * t) * np.exp(-t / 0.7) * 0.9
    crash = lp(noise(1.6), 5000) * np.exp(-t / 0.35) * 0.35
    out = sub + crash
    out[: len(k)] += k
    return np.tanh(out * 1.3)


def tick(freq=2200):
    t = t_arr(0.05)
    return np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.012) * 0.7


def key_click():
    t = t_arr(0.04)
    thock = np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.01)
    clk = bp(noise(0.04), 2500, 6500) * np.exp(-t / 0.006)
    return thock * 0.6 + clk * 0.8


def mouse_click():
    out = np.zeros(int(0.06 * SR))
    for off in (0, 0.028):
        c = hp(noise(0.01), 2000) * np.exp(-t_arr(0.01) / 0.002)
        out[int(off * SR):int(off * SR) + len(c)] += c * (1 if off == 0 else 0.6)
    return out


def chime():
    t = t_arr(1.2)
    out = np.zeros_like(t)
    for f, g in ((1318.5, 0.5), (1975.5, 0.35), (2637, 0.15)):
        out += np.sin(2 * np.pi * f * t) * np.exp(-t / 0.35) * g
    return out


def pop(f0=420, f1=980):
    t = t_arr(0.07)
    f = f0 + (f1 - f0) * (t / 0.07)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.02)


def slam():
    # punchy word-hit: short kick + clap layer
    k = kick()[: int(0.2 * SR)]
    c = clap()
    out = np.zeros(max(len(k), len(c)))
    out[: len(k)] += k * 0.8
    out[: len(c)] += c * 0.5
    return out


# =============== ARRANGEMENT ===============
BEAT = 15  # frames

# --- HOOK (0-60): sparse, tense. Word slams + typing frenzy
for fr in (0, 7, 15, 22, 30):
    place(sfx, slam(), f2s(fr), 0.75)
for i in range(16):  # hats every half beat, quiet
    place(music, hat(), f2s(i * 7.5), 0.18)
# drone
t = t_arr(4.0)
drone = (saw(note(45), 4.0) + saw(note(45), 4.0, 0.004)) * 0.5
drone = lp(drone, 220) * np.minimum(1, t / 0.3) * 0.22
place(music, drone, 0)
# typing frenzy f30-60 (accelerating)
fr = 32.0
gap = 3.2
while fr < 60:
    place(sfx, key_click(), f2s(fr), 0.45 + rng.uniform(0, 0.15))
    fr += gap
    gap = max(1.3, gap * 0.9)

# --- CHAOS (60-120): word hits + riser + drop gap
for fr in (60, 68, 75):
    place(sfx, slam(), f2s(fr), 0.8)
for fr in (62, 70, 78, 86, 92, 98, 104, 108):
    place(sfx, whoosh(0.18, 600, 4000), f2s(fr), 0.18)
place(sfx, riser(1.62), f2s(66), 0.8)
for i in range(8):  # snare roll building
    place(music, clap(), f2s(90 + i * 3.4), 0.12 + i * 0.05)
# silence gap 115-120 handled by envelope later

# --- DROP (120)
place(sfx, impact(), f2s(120), 1.0)
verb_send[f2s(120):f2s(120) + sec(0.5)] += 0  # placeholder for clarity

# groove from 120 to 405, kick every beat
groove_start, groove_end = 120, 405
for fr in range(groove_start, groove_end, BEAT):
    place(music, kick(), f2s(fr), 1.0)
    # sidechain duck
    s = f2s(fr)
    L = sec(0.22)
    e = min(N, s + L)
    sidechain[s:e] = np.minimum(sidechain[s:e], 0.25 + 0.75 * np.linspace(0, 1, e - s) ** 1.5)
for fr in range(groove_start, groove_end, BEAT):
    place(music, hat(), f2s(fr + 7.5), 0.3)
    if ((fr - groove_start) // BEAT) % 2 == 1:
        place(music, clap(), f2s(fr), 0.45)
for fr in range(groove_start, groove_end, BEAT * 4):
    place(music, hat(True), f2s(fr + BEAT * 3 + 7.5), 0.18)

# chords (A minor vamp): Am F C G, one per bar (60 frames)
chords = [
    [57, 60, 64, 69],  # Am
    [53, 57, 60, 65],  # F
    [55, 60, 64, 67],  # C
    [55, 59, 62, 67],  # G
]
roots = [45, 41, 48, 43]
bar = 60
idx = 0
for fr in range(groove_start, 450, bar):
    dur = min(bar, 450 - fr) / FPS
    ch = chords[idx % 4]
    pad = np.zeros(int(dur * SR))
    for m in ch:
        for dt in (-0.006, 0.0, 0.007):
            pad += saw(note(m), dur, dt)
    pad = lp(pad, 1800) * adsr(dur, 0.02, 0.2, 0.7, 0.08) * 0.08
    place(music, pad, f2s(fr))
    # offbeat stabs
    for b in range(4):
        sfr = fr + b * BEAT + 7.5
        if sfr >= groove_end:
            break
        sd = 0.12
        st = np.zeros(int(sd * SR))
        for m in ch:
            st += saw(note(m + 12), sd, 0.004) + saw(note(m + 12), sd, -0.004)
        st = lp(st, 3500) * adsr(sd, 0.002, 0.05, 0.3, 0.03) * 0.05
        place(music, st, f2s(sfr))
        place(verb_send, st, f2s(sfr), 0.6)
    # bass 8ths
    r = roots[idx % 4]
    for e8 in range(8):
        bfr = fr + e8 * 7.5
        if bfr >= groove_end:
            break
        bd = 0.2
        b = saw(note(r), bd) + 0.6 * np.sin(2 * np.pi * note(r - 12) * t_arr(bd))
        b = lp(b, 420) * adsr(bd, 0.003, 0.08, 0.5, 0.04) * 0.32
        place(music, b, f2s(bfr))
    idx += 1

# --- REVEAL SFX
place(sfx, whoosh(0.4, 300, 5000), f2s(126), 0.25)
place(sfx, pop(500, 1100), f2s(132), 0.25)
place(sfx, pop(500, 1100), f2s(140), 0.25)

# --- DEMO (165-285)
place(sfx, whoosh(0.35, 400, 7000), f2s(163), 0.45)
place(sfx, whoosh(0.9, 800, 9000, True) * 0.6, f2s(176), 0.35)  # scan sweep
for i in range(7):
    place(sfx, tick(1800 + i * 160), f2s(203 + i * 4), 0.45)
    place(verb_send, tick(1800 + i * 160), f2s(203 + i * 4), 0.3)
place(sfx, whoosh(0.25, 1500, 5000), f2s(236), 0.15)  # cursor glide
place(sfx, mouse_click(), f2s(252), 0.9)
place(sfx, chime(), f2s(255), 0.45)
place(verb_send, chime(), f2s(255), 0.5)

# --- MONTAGE (285-330)
for fr in (285, 293, 300, 308):
    place(sfx, slam(), f2s(fr), 0.55)
    place(sfx, whoosh(0.15, 1000, 6000), f2s(fr - 2), 0.2)
place(sfx, chime(), f2s(316), 0.25)

# --- WHATSAPP (330-375)
place(sfx, pop(380, 900), f2s(334), 0.6)
for i in range(3):
    place(sfx, tick(1200), f2s(344 + i * 3), 0.15)
place(sfx, pop(520, 1250), f2s(353), 0.65)
place(verb_send, pop(520, 1250), f2s(353), 0.4)

# --- MINUTES (375-405)
place(sfx, whoosh(0.3, 500, 4000), f2s(373), 0.3)
place(sfx, whoosh(0.18, 6000, 600, False), f2s(384), 0.5)  # strike swipe
place(sfx, slam(), f2s(390), 0.85)

# --- END (405-450)
place(sfx, impact(), f2s(405), 0.85)
place(sfx, chime(), f2s(407), 0.3)
place(verb_send, chime(), f2s(407), 0.6)
place(sfx, pop(600, 1200), f2s(418), 0.2)
place(sfx, pop(600, 1200), f2s(424), 0.2)

# ---------- MIX ----------
# reverb
ir_t = t_arr(1.4)
ir = rng.normal(0, 1, len(ir_t)) * np.exp(-ir_t / 0.35)
ir = lp(ir, 6000)
ir /= np.sqrt(np.sum(ir ** 2))
verb = fftconvolve(verb_send, ir)[:N] * 0.35

music *= sidechain
mix = music + sfx + verb

# drop gap: hard silence f115-120 except riser tail fade (classic pre-drop gap)
g0, g1 = f2s(114), f2s(120)
mix[g0:g1] *= np.linspace(1, 0, g1 - g0) ** 3
# fade out last 0.5s
fo = sec(0.5)
mix[-fo:] *= np.linspace(1, 0, fo) ** 2
mix[:sec(0.01)] *= np.linspace(0, 1, sec(0.01))

mix = hp(mix, 30)
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(mix * 1.5) / np.tanh(1.5)  # glue
mix *= 0.93
stereo = np.stack([mix, mix], axis=1)
# subtle width on music
wide = lp(music * sidechain, 8000)
delay = int(0.012 * SR)
stereo[delay:, 1] += wide[:-delay] * 0.04
stereo /= np.max(np.abs(stereo)) / 0.95
wavfile.write("public/soundtrack.wav", SR, (stereo * 32767).astype(np.int16))
print("wrote public/soundtrack.wav", stereo.shape)
