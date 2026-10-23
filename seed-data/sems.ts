/**
 * SEMS Surgical Industries range, transcribed from "SEMS_Categorized_Product_Catalogue.docx".
 * Each furniture/OT product page shows the slice of this list that belongs to it.
 */
import type { SpecTable } from './types';

export const SEMS: [code: string, product: string, description: string][] = [
  // 1. Hospital Beds
  ['S101', 'Motorized Remote Operated ICU Bed', '4-section ICU bed with motorized backrest, knee rest, Trendelenburg/reverse Trendelenburg and height adjustment. ABS split side rails and castors.'],
  ['S102', 'Four Function ICU Bed with ABS Panel', 'Manual 4-function ICU bed with backrest, knee rest, TB/RTB and height adjustment. ABS head/foot panels and side rails.'],
  ['S103', 'Three Function ICU Bed', 'Manual ICU bed with backrest, knee rest and height adjustment, ABS side rails and removable head/foot panels.'],
  ['S104', 'Fowler Bed – Deluxe', '2-function manual bed with adjustable backrest and knee rest, ABS head/foot panels and locking castors.'],
  ['S105', 'Fowler Bed', 'Standard manual Fowler bed with adjustable backrest and knee rest.'],
  ['S106', 'Semi Fowler Bed – Deluxe', 'Single-function bed with adjustable backrest, ABS panels and locking castors.'],
  ['S107', 'Semi Fowler Bed', 'Basic manual Semi-Fowler bed with adjustable backrest and removable head/foot panels.'],
  ['S108', 'Plain Bed – Premium', 'Basic hospital bed with ABS removable head/foot panels and urine bag holder.'],
  ['S109', 'Plain Bed', 'Standard hospital bed with SS/MS head and foot panels and urine bag holder.'],
  ['S110', 'Pediatric Bed – Deluxe', 'Pediatric bed with adjustable backrest, telescopic/collapsible side rails and urine bag holder.'],
  ['S111', 'Pediatric Bed', 'Basic pediatric bed with CRCA sheet top, support structure and detachable full-length rails.'],
  ['S112', 'Reclining Chair Cum Attendant Bed', 'Convertible attendant furniture that can function as a reclining chair and bed.'],
  ['S113', 'Attendant Bed', 'Compact attendant bed with single-section mattress platform and SS/MS head and foot panels.'],
  ['S114', 'Labour Bed', 'Labour/delivery bed with adjustable height, removable mattress sections, lithotomy crutches and central locking castors.'],
  ['S115', 'Labour Table', 'Labour table with adjustable backrest, Trendelenburg/reverse Trendelenburg, U-notch with bowl and sliding foot end.'],
  // 2. Hospital Couches & Examination Tables
  ['S201', 'Examination Couch', 'Examination couch with CRC frame, cabinets, drawers, adjustable headrest, sliding step stool and BP apparatus tray.'],
  ['S202', 'Examination Table', 'Basic examination table with CRCA tubular framework, drawer and cabinet.'],
  ['S203', 'Obstetrics-Gynaec Table', 'Examination/delivery table designed for obstetrics and gynaecology applications.'],
  ['S204', 'Examination Couch – U Cut', 'Examination couch incorporating a U-cut design for specific examination procedures.'],
  ['S205', 'Examination Table', 'General-purpose examination table for hospital clinical examination areas.'],
  // 3. Hospital Stretchers & Emergency Trolleys
  ['S301', 'Emergency & Recovery Trolley', 'Emergency/recovery trolley with X-ray-permeable stretcher, height adjustment, adjustable backrest, side rails, safety belts and castors.'],
  ['S302', 'Folding Stretcher', 'Foldable stretcher designed for patient transportation and emergency use.'],
  ['S303', 'Stretcher on Trolley', 'Patient stretcher mounted on a trolley for easier hospital transportation.'],
  ['S304', 'Stretcher on Trolley – Backrest Adjustable', 'Trolley stretcher with adjustable backrest for improved patient positioning.'],
  // 4. Medical & Hospital Trolleys
  ['S401', 'ECG Trolley', 'Mobile trolley designed for placing and moving an ECG machine.'],
  ['S402', 'Instrument Trolley', 'Mobile trolley for surgical/medical instruments and supplies.'],
  ['S403', 'Defibrillator Trolley', 'Dedicated trolley for positioning and transporting a defibrillator.'],
  ['S404', 'Medicine Crash Cart', 'Emergency medication and equipment trolley for critical-care situations.'],
  ['S405', 'Medicine Crash Cart Cum Drug Trolley', 'Combined crash cart and drug-storage trolley for emergency/clinical use.'],
  ['S406', 'Monitor Trolley', 'Mobile trolley for patient/bedside monitor placement.'],
  ['S407', 'Dressing Trolley', 'Trolley for carrying dressing materials and supplies.'],
  ['S408', 'Mayo Trolley', 'Mayo-style instrument trolley for surgical procedures.'],
  ['S409', 'C-Curve Trolley', 'C-shaped trolley designed for specific clinical/OT applications.'],
  ['S410', 'Solid Linen Trolley', 'Trolley for collection/transportation of hospital linen.'],
  ['S411', 'Linen Trolley', 'Mobile trolley for hospital linen handling.'],
  ['S412', 'Drum Trolley', 'Trolley for transportation/storage of medical drums.'],
  ['S413', 'Cylinder Trolley', 'Trolley designed for safe movement of medical gas cylinders.'],
  // 5. Bedside Lockers
  ['S501', 'Normal Locker', 'Standard bedside locker for patient belongings and basic storage.'],
  ['S502', '3-Top Locker', 'Bedside locker with three-top configuration for additional utility.'],
  ['S503', 'Deluxe Locker – SS Top', 'Deluxe bedside locker with stainless-steel top.'],
  ['S504', 'Deluxe Locker – ABS Top', 'Deluxe bedside locker with ABS top.'],
  ['S505', 'Premium Locker', 'Premium bedside storage solution for hospital rooms.'],
  // 6. Stools & Foot Step
  ['S601', 'Revolving Stool', 'Rotating stool for clinical/examination areas.'],
  ['S602', 'Attendant Stool', 'Seating solution for attendants and hospital staff.'],
  ['S603', 'Foot Step', 'Step stool for assisting patients/staff in accessing beds or equipment.'],
  // 7. Over-Bed Tables
  ['S701', 'Over Bed Table – Fixed Top', 'Bedside table with fixed top for meals, writing and patient activities.'],
  ['S702', 'Over Bed Table – Adjustable Top', 'Adjustable over-bed table allowing better positioning for patient use.'],
  // 8. Other Hospital Equipment & Furniture
  ['S801', 'Bed Side Screen', 'Provides privacy between patients/beds.'],
  ['S802', 'Bowl Stand', 'Stand for holding clinical/medical bowls.'],
  ['S803', 'Kick Bucket', 'Clinical utility/waste bucket.'],
  ['S804', 'Crib Carrier', 'Equipment for carrying/supporting infants or pediatric patients.'],
  ['S805', 'Scrubber', 'Hospital/clinical cleaning-related equipment.'],
  ['S806', 'Wheel Chair', 'Mobility aid for patient transportation.'],
  ['S807', 'Almirah', 'Storage cabinet for hospital/staff use.'],
  ['S808', 'Staff Locker', 'Personal storage locker for hospital staff.'],
  ['S809', 'Saline Stand', 'Stand for IV fluid/saline bags.'],
  ['S810', 'Book Shelf', 'Storage/display shelf for books and documents.'],
  ['S811', 'Blood Donation Chair', 'Chair designed for blood donation procedures.'],
  ['S812', 'Dog Table', 'Table designed for veterinary/animal applications.'],
  ['S813', 'Monitor Stand', 'Stand for supporting a medical monitor.'],
  ['S814', 'Electric Examination Table', 'Electrically adjustable examination table.'],
  ['S815', 'Lobby Bench', 'Seating solution for hospital waiting/lobby areas.'],
  ['S816', 'Tilt Table', 'Tilting table for clinical/rehabilitation applications.'],
  ['S817', 'Suspension Bed', 'Specialized suspension-type patient bed.'],
  ['S818', 'Canteen Table', 'Table for hospital canteen/dining areas.'],
  ['S819', 'Food Distribution Trolley', 'Trolley for transporting and distributing food within hospitals.'],
  // 9. Mattresses & Bed Accessories
  ['S901', 'Mattress for Plain/Attendant Bed', 'Mattress designed for plain and attendant beds.'],
  ['S902', 'Two Section Mattress', 'Two-section mattress for Semi-Fowler beds.'],
  ['S903', 'Four Section Mattress', 'Four-section mattress for Fowler and ICU beds.'],
  ['S904', 'Mattress for Labour Bed/Table', 'Mattress designed for labour beds and labour tables.'],
  ['S905', 'Head Split Mattress', 'Split-head mattress for examination couches/tables.'],
  ['S906', 'Two Section U-Cut Mattress', 'U-cut mattress for gynaec tables and examination couches.'],
  ['S907', 'ABS Panels', 'Replacement/add-on ABS bed panels.'],
  ['S908', 'ABS Side Railings', 'ABS safety side railings for hospital beds.'],
  ['S909', 'SS/MS Side Railings', 'Stainless-steel/mild-steel side railings.'],
  ['S910', 'Caster Wheel', 'Replacement/mobile caster wheels for hospital furniture.'],
  ['S911', 'IV Rods', 'IV rods available in two-hook/four-hook configurations.'],
  ['S912', 'SS/MS Panel', 'Stainless-steel/mild-steel panels for hospital furniture.'],
  ['S913', 'Over-Bed Table Top', 'Replacement/accessory top for over-bed tables.'],
  ['S914', 'Actuators & Hydraulics', 'Actuator/hydraulic components for applicable adjustable hospital equipment.'],
  // 10. OT – Operation Theatre Equipment
  ['OT-101', 'C-Arm Compatible OT Table', 'OT table designed to accommodate C-Arm imaging during surgical procedures.'],
  ['OT-102', 'Hydraulic OT Table', 'Hydraulic operating table for positioning patients during surgery.'],
  ['OT-103', 'Double Dome Ceiling LED Light 4+4', 'Double-dome LED OT light configuration with 4+4 light arrangement.'],
  ['OT-104', 'Double Dome Ceiling LED Light', 'Double-dome ceiling-mounted LED operating light.'],
  ['OT-105', 'Single Dome Ceiling LED Light', 'Single-dome ceiling-mounted LED operating light.'],
  ['OT-106', 'Examination Light', 'Clinical examination light for examination/procedure areas.'],
];

/** Product-range table for the given SEMS codes (in catalogue order). */
export function semsRange(codes: string[]): SpecTable {
  const want = new Set(codes);
  return { head: ['Code', 'Product', 'Description'], wrap: true, rows: SEMS.filter(([c]) => want.has(c)).map(([c, p, d]) => [c, p, d]) };
}

/** All codes in an inclusive numeric range with a shared prefix, e.g. codes('S', 101, 103). */
export const codes = (prefix: string, from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => prefix + (from + i));
