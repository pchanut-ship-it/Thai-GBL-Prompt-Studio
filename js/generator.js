// js/generator.js - ตัวขับเคลื่อนการสร้าง Prompt อัจฉริยะ (Dynamic Prompt Generator Engine)

class PromptGenerator {
  /**
   * สร้าง Prompt ฉบับสมบูรณ์สำหรับสั่ง AI พัฒนา Web Application เกมการเรียนรู้ภาษาไทย
   * @param {Object} options ข้อมูลการตั้งค่าจากผู้ใช้
   * @returns {string} Prompt ที่จัดรูปแบบพร้อมใช้งาน
   */
  static generate(options) {
    const {
      gameId = 1,
      customTitle = "",
      gradeLevel = "ประถมศึกษาปีที่ 2–4",
      learningUnit = "",
      learningOutcome = "",
      techStack = "React + Tailwind CSS",
      features = [],
      customQuestions = "",
      tone = "การศึกษาเชิงรุก สนุกสนาน ตัวการ์ตูนสดใส",
      difficulty = "3 ระดับ (ง่าย / ปานกลาง / ท้าทาย)"
    } = options;

    const baseGame = gamesData.find(g => g.id === Number(gameId)) || gamesData[0];
    const appTitle = customTitle.trim() || baseGame.title;
    const finalUnit = learningUnit.trim() || baseGame.defaultUnit;
    const finalOutcome = learningOutcome.trim() || `ผู้เรียนสามารถเข้าใจและนำความรู้เรื่อง "${finalUnit}" ไปประยุกต์ใช้ในการสื่อสารได้อย่างถูกต้องแม่นยำอย่างน้อย 80%`;

    // สร้างข้อกำหนดทางกลไกเกม
    let promptText = `สร้าง Web Application เกมการเรียนรู้ภาษาไทย (Game-based Learning) ชื่อ "${appTitle}"
======================================================================
[1] ข้อมูลทั่วไปและเป้าหมายการเรียนรู้
- ชื่อเกม: ${appTitle} (${baseGame.englishTitle})
- กลุ่มเป้าหมาย: ${gradeLevel}
- หน่วยการเรียนรู้หลัก: ${finalUnit}
- ทักษะภาษาไทยที่มุ่งเน้น: ${baseGame.skills}
- ผลลัพธ์การเรียนรู้ที่คาดหวัง: ${finalOutcome}
- ระดับความยาก: ${difficulty} มีระบบปรับความยากตามระดับความสามารถ (Adaptive Learning)

[2] รูปแบบการเล่นและกลไกหลัก (Core Gameplay Loop)
- รูปแบบหลัก: ${baseGame.playStyle}
- สรุปแนวคิดเกม: ${baseGame.brief}
- บรรยากาศและธีมการออกแบบ: ${tone}

[3] ระบบเกมและองค์ประกอบการเรียนรู้ (Game-Based Learning Features)`;

    // แทรกฟีเจอร์ตามที่เลือก
    if (features.includes("feedback")) {
      promptText += `\n- ระบบ Instant Feedback เชิงสร้างสรรค์: เมื่อตอบคำถาม ไม่ใช่แค่บอกว่าถูกหรือผิด แต่ต้องแสดงเหตุผลทางหลักไวยากรณ์ภาษาไทย ระบุจุดที่ถูกต้องหรือข้อบกพร่อง พร้อมตัวอย่างการใช้งานที่ถูกต้องตามพจนานุกรมฉบับราชบัณฑิตยสถาน`;
    }
    if (features.includes("practice")) {
      promptText += `\n- โหมดฝึกฝนก่อนแข่งขัน (Practice Mode): มีพื้นที่ให้ผู้เรียนทบทวนคำศัพท์/เนื้อหาก่อนเข้าสู่โหมดจับเวลาแข่งขัน เพื่อลดความกังวลและสร้างความมั่นใจสำหรับผู้เรียนที่มีพื้นฐานแตกต่างกัน`;
    }
    if (features.includes("hints")) {
      promptText += `\n- ระบบคำใบ้กระตุ้นความคิด (Scaffolding Hints): มีปุ่มคำใบ้สูงสุด 3 ระดับ โดยคำใบ้ต้องเชื่อมโยงกับกระบวนการคิด เช่น การสังเกตสระ พยัญชนะต้น บริบท หรือรากศัพท์ ไม่ใช่การบอกเฉลยคำตอบโดยตรง (การใช้คำใบ้จะหักแต้มโบนัสเล็กน้อย)`;
    }
    if (features.includes("effort_reward")) {
      promptText += `\n- ระบบยกย่องความพยายาม (Effort-Based Reward): มีระบบสะสม Streak ตอบถูกต่อเนื่อง, โบนัสสำหรับการกลับมาทบทวนซ้ำ และเหรียญตราเกียรติยศ (Badges) เพื่อเสริมสร้างแรงจูงใจภายใน (Intrinsic Motivation)`;
    }
    if (features.includes("analytics")) {
      promptText += `\n- ระบบวิเคราะห์ผลสัมฤทธิ์รายทักษะ (Skill Mastery Analytics): มีหน้าจอแสดงสถิติความแม่นยำแยกตามทักษะย่อย เช่น แสดงว่าสับสนคำลักษณนามประเภทใด หรือผิดมาตราตัวสะกดแม่ใด พร้อมกราฟแท่งหรือ Radar Chart`;
    }
    if (features.includes("teacher_admin")) {
      promptText += `\n- ระบบจัดการคลังคำถามสำหรับครู (Teacher CMS): มีหน้าเฉพาะสำหรับคุณครู สามารถเพิ่ม/แก้ไข/ลบชุดคำศัพท์และโจทย์คำถามได้เอง มีระบบนำเข้า-ส่งออก (Import/Export) ผ่านไฟล์ JSON หรือ CSV`;
    }
    if (features.includes("speech")) {
      promptText += `\n- ระบบเสียงสังเคราะห์ภาษาไทย (Web Speech API): มีปุ่มกดฟังเสียงอ่านคำศัพท์ ประโยค หรือคำใบ้ภาษาไทยชัดเจน เพื่อส่งเสริมทักษะการฟังและการออกเสียง`;
    }
    if (features.includes("accessibility")) {
      promptText += `\n- การเข้าถึงและออกแบบเพื่อทุกคน (Accessibility): รองรับการขยายขนาดตัวอักษร, ปรับโหมดสีคอนทราสต์สูง, ปุ่มกดขนาดใหญ่สัมผัสง่ายบนหน้าจอสัมผัส และไม่ใช้สีเป็นตัวบ่งชี้สถานะคำตอบเพียงอย่างเดียว`;
    }
    if (features.includes("classroom_mode")) {
      promptText += `\n- โหมดแข่งขันในชั้นเรียน (Classroom / Projector Mode): มีหน้าจอแสดงผลขนาดใหญ่สำหรับฉายโปรเจกเตอร์หน้าห้อง พร้อมระบบนับคะแนน Leaderboard รวมของห้องเรียน`;
    }

    promptText += `\n\n[4] โครงสร้างหน้าจอ (User Interface & Screens)
1. หน้าแรก (Home / Lobby): ปุ่มเริ่มเล่นเกม, เลือกระดับความยาก, เมนูเข้าสู่โหมดฝึกฝน, และปุ่มเปิด/ปิดเสียง
2. หน้าเล่นเกมหลัก (Main Game Area): แสดงโจทย์คำถามชัดเจน, เวลาที่เหลือ, หลอดพลังชีวิต/ดาว, ปุ่มคำใบ้ และพื้นที่โต้ตอบ
3. หน้าสรุปผล (Game Summary): คะแนนรวม, ดาวที่ได้รับ, วิเคราะห์จุดแข็งและจุดที่ควรทบทวน พร้อมปุ่มเล่นซ้ำ
4. หน้าแดชบอร์ดครู (Teacher Dashboard): ดูสถิติผลการเล่นของนักเรียน และจัดการคลังข้อสอบ

[5] ข้อกำหนดทางเทคนิคและการพัฒนา
- พัฒนาด้วยเทคโนโลยี: ${techStack}
- การจัดเก็บข้อมูล: บันทึกข้อมูลคะแนน ประวัติการเล่น และคลังคำถามลงใน LocalStorage ของเบราว์เซอร์
- การแสดงผล: Responsive Web Application แสดงผลได้สมบูรณ์แบบทั้งบนสมาร์ตโฟน แท็บเล็ต และจอคอมพิวเตอร์
- ภาษาและเนื้อหา: ภาษาไทยถูกต้องตามอักขรวิธี 100% ตัวอักษรใช้ฟอนต์อ่านง่าย เช่น Prompt, Kanit หรือ Sarabun
- การทำงาน: ให้โค้ดพร้อมทำงานได้ทันที (Complete, runnable, standalone code) พร้อมข้อมูลคำถามตัวอย่างเริ่มต้นอย่างน้อย 20-30 ข้อ`;

    // ใส่คลังคำถามที่คุณครูกำหนดเองถ้ามี
    if (customQuestions && customQuestions.trim().length > 0) {
      promptText += `\n\n[6] ข้อมูลคลังคำศัพท์และคำถามเฉพาะของคุณครู (Custom Dataset)
ให้นำชุดข้อมูลต่อไปนี้ไปใช้เป็นคลังคำถามเริ่มต้นในเกม:
${customQuestions.trim()}`;
    }

    return promptText;
  }
}
