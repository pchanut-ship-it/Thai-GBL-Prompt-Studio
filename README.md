# 🎮 Thai GBL Prompt Studio (คลังพร้อมต์เกมภาษาไทยด้วย AI)

**Thai GBL Prompt Studio** คือเว็บแอปพลิเคชันคลังคำสั่ง AI (Master Prompts) และระบบสร้าง Prompt อัจฉริยะสำหรับพัฒนา Web Application เพื่อการเรียนรู้ภาษาไทยผ่านเกม (Game-based Learning) ครบทั้ง 20 รูปแบบเกมตามหลักสูตรการศึกษาไทย

---

## 🌟 ฟีเจอร์หลัก (Key Features)

1. **คลังเกมการเรียนรู้ภาษาไทยครบทั้ง 20 เกม (Game Gallery)**
   - แสดงภาพตัวอย่างหน้าจอเกม (Sample Game Mockup & Visuals) สำหรับทุกเกม
   - **บทสรุปภาษาไทยแบบกระชับ (Thai Brief)**: ระบุทักษะภาษาไทย, รูปแบบการเล่น, จุดเด่น และระดับชั้น
   - **ปุ่ม "Copy Prompt"**: คัดลอกคำสั่งพร้อมต์ฉบับเต็มลงคลิปบอร์ดได้ทันที พร้อมแจ้งเตือน Toast สวยงาม
   - ระบบค้นหาแบบเรียลไทม์ (Live Search) และแท็บกรองตามหมวดหมู่ทักษะ
   - แนะนำ **5 รูปแบบเกมที่เริ่มทำได้ง่ายและเร็วที่สุด** สำหรับครูที่ต้องการเริ่มต้นทันที

2. **ระบบสร้างและปรับแต่ง Prompt (Custom Prompt Generator)**
   - เลือกเกมต้นแบบ 1 จาก 20 เกม
   - ปรับเปลี่ยนระดับชั้น (ป.1–3, ป.4–6, ม.1–3, ม.4–6, อุดมศึกษา/บุคคลทั่วไป)
   - ปรับเปลี่ยนหน่วยการเรียนรู้ และเพิ่มชุดคำศัพท์/ข้อสอบเฉพาะของคุณครูได้เอง
   - เลือกเทคโนโลยีที่ต้องการให้ AI เขียนโค้ด เช่น React + Tailwind CSS หรือ Single-File HTML5 (เปิดได้ทันทีโดยไม่ต้องติดตั้ง Node)
   - ปรับระดับความยาก (ง่าย / ปานกลาง / ท้าทาย หรือ Adaptive)
   - เลือกฟีเจอร์ GBL: Feedback พร้อมหลักภาษา, โหมดฝึกฝน, คำใบ้กระตุ้นคิด, รางวัลความพยายาม, สถิติรายทักษะ, หน้าจัดการครู (CMS), เสียงอ่านสังเคราะห์ (Web Speech API) และการเข้าถึง (Accessibility)

3. **คู่มือ 10 องค์ประกอบสำคัญในการสั่ง AI (GBL Pedagogical Principles)**
   - รวบรวมแนวปฏิบัติที่ดีที่สุดในการเขียนคำสั่ง AI ให้พัฒนาเกมที่เป็น "การเรียนรู้ผ่านเกม" อย่างแท้จริง

4. **การส่งออกข้อมูล (Export)**
   - ปุ่มดาวน์โหลด Prompt แต่ละเกมเป็นไฟล์ `.md`
   - ปุ่ม Export คลัง Prompt ทั้ง 20 เกมพร้อมกันเป็นเอกสาร Markdown ฉบับสมบูรณ์

---

## 🚀 วิธีการเปิดใช้งาน (How to Run)

ไม่ต้องติดตั้งโปรแกรมหรือรันเซิร์ฟเวอร์ใดๆ! สามารถเปิดใช้งานได้ทันที:

1. ดับเบิลคลิกไฟล์ **`index.html`** ในโฟลเดอร์นี้เพื่อเปิดผ่านเว็บเบราว์เซอร์ใดก็ได้ (Google Chrome, Microsoft Edge, Safari, Firefox)
2. หรือหากต้องการรัน Local Server สามารถใช้ VS Code Live Server หรือเปิดผ่านเว็บเบราว์เซอร์ได้ทันที

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```
Prompt Gallery เกมภาษาไทย/
│
├── index.html                 # หน้าเว็บหลัก (Responsive UI, Tailwind CSS, Lucide Icons)
├── README.md                  # เอกสารแนะนำการใช้งาน
│
├── assets/
│   └── images/                # คลังภาพตัวอย่างหน้าจอเกมครบทั้ง 20 เกม
│       ├── hero_banner.jpg
│       ├── game_1_treasure.jpg
│       ├── game_2_detective.jpg
│       ├── game_3_royal.jpg
│       ├── game_4_classifier.jpg
│       ├── game_5_runner.jpg
│       ├── game_6_factory.jpg
│       ├── game_7_story.jpg
│       ├── game_8_escape.jpg
│       ├── game_9_loanword.jpg
│       ├── game_10_idiom.jpg
│       ├── game_11_court.svg
│       ├── game_12_reading.jpg
│       ├── game_13_journalist.svg
│       ├── game_14_cluster.svg
│       ├── game_15_monster.jpg
│       ├── game_16_bingo.svg
│       ├── game_17_cards.svg
│       ├── game_18_literature.svg
│       ├── game_19_tonelab.svg
│       └── game_20_factchecker.jpg
│
├── data/
│   └── gamesData.js           # ฐานข้อมูลเกม 20 เกม ข้อมูลสรุป ทักษะ และ Master Prompts
│
├── js/
│   ├── generator.js           # ตัวขับเคลื่อนการประกอบ Prompt ตามการตั้งค่าของผู้ใช้
│   └── app.js                 # ระบบอินเทอร์แอ็กชัน, ค้นหา, กรอง, คัดลอกคลิปบอร์ด, ระบบเสียง และ Modal
│
└── styles/
    └── main.css               # สไตล์เพิ่มเติม ฟอนต์ Prompt/Sarabun และแอนิเมชัน
```

---

## 🎯 รายชื่อทั้ง 20 เกมในระบบ

1. **ล่าขุมทรัพย์มาตราตัวสะกด** (Spelling Treasure Quest)
2. **นักสืบคำผิด** (Spelling & Grammar Detective) ⭐ *แนะนำเริ่มเร็ว*
3. **จับคู่คำราชาศัพท์** (Royal Vocabulary Match) ⭐ *แนะนำเริ่มเร็ว*
4. **ศึกคำลักษณนาม** (Thai Classifier Battle) ⭐ *แนะนำเริ่มเร็ว*
5. **วิ่งเก็บคำพ้อง** (Homophone Runner)
6. **โรงงานสร้างประโยค** (Sentence Assembly Factory) ⭐ *แนะนำเริ่มเร็ว*
7. **เล่าเรื่องจากภาพ** (Picture Storyteller AI)
8. **ห้องหนีภัยภาษาไทย** (Thai Escape Room)
9. **คดีลับคำยืม** (Loanword Mystery Dossier)
10. **ตลาดนัดสำนวนไทย** (Thai Idiom & Proverb Market)
11. **ศาลตัดสินภาษา** (Thai Language Courtroom)
12. **ภารกิจนักอ่านจับใจความ** (Reading Comprehension Quest) ⭐ *แนะนำเริ่มเร็ว*
13. **นักข่าวฝึกหัด** (Junior Journalist Studio)
14. **ภารกิจพิชิตอักษรนำ** (Leading & Cluster Consonant Quest)
15. **สะกดคำพิชิตมอนสเตอร์** (Monster Spelling Slayer RPG)
16. **บิงโกภาษาไทยออนไลน์** (Multiplayer Thai Bingo Online)
17. **ไพ่คำเป็น–คำตาย** (Alive vs Dead Syllables Card Battle)
18. **ประลองวรรณคดี** (Thai Literature Realm Quest)
19. **ห้องทดลองเสียงวรรณยุกต์** (Thai Tone Acoustic Lab)
20. **ภารกิจ AI นักพิสูจน์ข่าว** (Fact-Checker AI Quest)
