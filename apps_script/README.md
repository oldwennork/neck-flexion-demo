# ตั้งค่าให้เดโมบันทึกลง Google Drive

เดโมส่งไฟล์ CSV ไปที่ Google Apps Script ซึ่งเขียนไฟล์ลงโฟลเดอร์ `NeckFlexion_CSV` ใน Drive ของบัญชีที่ตั้งค่า
ผู้ใช้เดโมไม่ต้อง login Google — ทำครั้งเดียว ใช้เวลาราว 10 นาที

## ขั้นตอน

1. ไปที่ <https://script.google.com> ด้วยบัญชี Google ที่อยากให้ไฟล์ไปอยู่ → **New project**
2. ตั้งชื่อโปรเจกต์ (มุมซ้ายบน) เช่น `Neck Flexion Upload`
3. ลบโค้ดเดิมในไฟล์ `Code.gs` ทั้งหมด แล้ววางโค้ดจาก [`drive_upload.gs`](drive_upload.gs) → กด 💾 Save
4. (ไม่บังคับ) ถ้าอยากใช้โฟลเดอร์ที่มีอยู่แล้ว ใส่ ID โฟลเดอร์ใน `FOLDER_ID`
5. กด **Deploy → New deployment** → ไอคอนเฟือง ⚙ → เลือก **Web app** แล้วตั้งค่า
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
6. กด **Deploy** → **Authorize access** → เลือกบัญชีตัวเอง
   - ถ้าขึ้น "Google hasn't verified this app" กด **Advanced → Go to … (unsafe)** (เป็นสคริปต์ของเราเอง)
   - กด **Allow** ให้สิทธิ์จัดการไฟล์ใน Drive
7. คัดลอก **Web app URL** (ลงท้ายด้วย `/exec`)
8. เปิด URL นั้นในเบราว์เซอร์ ต้องเห็น `{"ok":true,...}` และมีโฟลเดอร์ `NeckFlexion_CSV` โผล่ใน Drive
9. ใส่ URL ใน `head_pitch_demo.html` ที่บรรทัด `const DRIVE_ENDPOINT = "";`

## ถ้าแก้โค้ดสคริปต์ภายหลัง

กด **Deploy → Manage deployments → ✏ Edit → Version: New version → Deploy**
URL เดิมจะใช้ได้ต่อ (ถ้ากด New deployment จะได้ URL ใหม่ ต้องไปแก้ในเดโมด้วย)

## ข้อควรรู้

- URL อยู่ในโค้ดเดโมที่เปิดสาธารณะ ใครเห็นก็ส่งไฟล์เข้าโฟลเดอร์ได้ สคริปต์จึงรับเฉพาะ CSV ของเดโม
  ชื่อไฟล์ถูกรูปแบบ และไม่เกิน 2 MB — ถ้าวันหนึ่งเจอไฟล์แปลกๆ ให้ deploy ใหม่เพื่อเปลี่ยน URL
- ไฟล์ชื่อ `ชื่อเล่น_ปี-เดือน-วัน_ชั่วโมง-นาที-วินาที.csv` ตามเวลาของเครื่องที่วัด
- โหมดทดสอบของ admin ไม่ส่งเข้า Drive (ดาวน์โหลดลงเครื่องเป็น `test_….csv`)
