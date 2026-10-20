/**
 * Neck Flexion Demo -> Google Drive
 *
 * รับไฟล์ CSV จากเดโม (POST) แล้วเขียนลงโฟลเดอร์ใน Drive ของเจ้าของสคริปต์
 * ผู้ใช้เดโมจึงไม่ต้อง login Google — ดูวิธีตั้งค่าใน README.md โฟลเดอร์เดียวกัน
 *
 * URL ของ web app อยู่ในโค้ดเดโมที่เปิดสาธารณะ ใครเห็นก็ส่งไฟล์เข้ามาได้
 * จึงรับเฉพาะ CSV ที่หน้าตาเป็นของเดโม ชื่อไฟล์ถูกรูปแบบ และขนาดไม่เกินกำหนด
 */

// ชื่อโฟลเดอร์ใน My Drive (สร้างให้อัตโนมัติถ้ายังไม่มี)
const FOLDER_NAME = 'NeckFlexion_CSV';
// ถ้าอยากใช้โฟลเดอร์ที่มีอยู่แล้ว (เช่นโฟลเดอร์ที่แชร์กับทีม) ใส่ ID ของโฟลเดอร์ตรงนี้
// ID คือส่วนท้ายของลิงก์ drive.google.com/drive/folders/<ID>
const FOLDER_ID = '';

const MAX_CHARS = 2 * 1024 * 1024;  // CSV ปกติ ~100-300 KB
// ชื่อเล่น_YYYY-MM-DD_HH-mm-ss.csv  (ชื่อเล่นภาษาไทยได้ ห้ามอักขระที่ใช้ในชื่อไฟล์ไม่ได้)
const NAME_RE = /^[^\\/:*?"<>|#%,\s]{1,30}_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.csv$/;
const CSV_HEADER = 't_sec,flexion_deg,';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const filename = String(body.filename || '');
    const csv = String(body.csv || '');

    if (body.app !== 'neck_flexion_demo') return reply_({ ok: false, error: 'bad_app' });
    if (!NAME_RE.test(filename)) return reply_({ ok: false, error: 'bad_filename' });
    if (!csv.startsWith(CSV_HEADER)) return reply_({ ok: false, error: 'bad_csv' });
    if (csv.length > MAX_CHARS) return reply_({ ok: false, error: 'too_large' });

    const file = getFolder_().createFile(filename, csv, MimeType.CSV);
    return reply_({ ok: true, id: file.getId(), name: filename });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  }
}

// เปิด URL ของ web app ในเบราว์เซอร์เพื่อเช็คว่า deploy สำเร็จ
function doGet() {
  return reply_({ ok: true, service: 'neck_flexion_demo drive upload', folder: getFolder_().getName() });
}

function getFolder_() {
  if (FOLDER_ID) return DriveApp.getFolderById(FOLDER_ID);
  // lock กันสองเครื่องส่งพร้อมกันครั้งแรกแล้วได้โฟลเดอร์ชื่อซ้ำ 2 อัน
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const it = DriveApp.getFoldersByName(FOLDER_NAME);
    return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
  } finally {
    lock.releaseLock();
  }
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
