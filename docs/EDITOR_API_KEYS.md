# Editor API Keys

**Keep these keys private. Each editor should only receive their own key.**

---

## 🧪 NARJES TEST KEYS

| Account | API Key | Brand |
|---------|---------|-------|
| **Narjes (Aurapets)** | `narjes_aurapets_k8m3n7p2q9w4x1y6z0` | Test Aurapets content |
| **Narjes (LuminEye)** | `narjes_lumineye_j5h9l2o6r3t8v1a4b7` | Test LuminEye content |

Use these to test the system before giving keys to editors.

See `TESTING_GUIDE.md` for step-by-step testing instructions.

---

## 🐕 AURAPETS EDITORS

| Editor | API Key |
|--------|---------|
| **James** | `ap_james_7f3k9m2x5v8b4n1q6w0z` |
| **John** | `ap_john_8h4l0n3y6w9c5p2r7x1a` |
| **Antoni** | `ap_antoni_9j5m1p4z7x0d6q3s8y2b` |
| **Daniel** | `ap_daniel_0k6n2q5a8y1e7r4t9z3c` |
| **Eyasu** | `ap_eyasu_1l7o3r6b9z2f8s5u0a4d` |
| **Eugene** | `ap_eugene_2m8p4s7c0a3g9t6v1b5e` |

---

## 👁️ LUMINEYE EDITORS

| Editor | API Key |
|--------|---------|
| **Santanu** | `le_santanu_3n9q5t8d1b4h0u7w2c6f` |
| **Daniel 2** | `le_daniel2_4o0r6u9e2c5i1v8x3d7g` |

---

## How to Use

1. Give each editor their unique API key
2. They go to: `https://your-vercel-url.vercel.app`
3. Enter their API key
4. Select tool (Veo 3, MakeUGC, ElevenLabs, Higgsfield)
5. Enter their script/prompt
6. Submit

## What Happens

- All requests are logged
- AI analyzes if content matches their brand
- If off-brand: You get an instant email at narjes@w16media.co
- Email includes the full script they tried to generate

## Key Format

- `ap_` = Aurapets (dog eye health)
- `le_` = LuminEye (human eye health)

If James (Aurapets) tries to create content about human weight loss, crypto, or anything not dog-related → **You get alerted immediately**.
