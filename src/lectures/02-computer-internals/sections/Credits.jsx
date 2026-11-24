/*
 * Credits for the hardware photos in assets/lecture2/ (all from Wikimedia Commons).
 * CC BY and CC BY-SA licences require the author and licence to be shown, so keep
 * this list in step with the files there.
 */
const photos = [
  ['Keyboard', 'QWERTY_keyboard.jpg', 'MichaelMaggs', 'CC BY-SA 3.0'],
  ['Motherboard', 'Asus-ROG-Strix-Z390-F-Gaming-Motherboard_20201120_DSC6025.jpg', 'PantheraLeo1359531', 'CC BY 4.0'],
  ['CPU under its fan', 'PCWare_IPM41-D3_Motherboard_(53161965807).jpg', 'Davidson F', 'CC0'],
  ['CPU with its speed printed', 'Intel_CPU_Core_i7_6700K_Skylake_top.jpg', 'Eric Gaba (Sting)', 'CC BY-SA 4.0'],
  ['Inside a CPU (cores)', 'Zen2_Matisse_Ryzen_7nm_Core_Die_shot.jpg', 'Fritzchens Fritz', 'CC0'],
  ['Intel logo', 'Intel_logo_(2020,_dark_blue).svg', 'Intel', 'Public domain'],
  ['AMD logo', 'AMD_Logo.svg', 'AMD', 'Public domain'],
  ['Apple logo', 'Apple_logo_black.svg', 'Apple', 'Public domain'],
  ['Qualcomm logo', 'Qualcomm-Logo.svg', 'Qualcomm', 'Public domain'],
  ['MediaTek logo', 'MediaTek_logo.svg', 'MediaTek', 'Public domain'],
  ['Mouse', '3-Tasten-Maus_Microsoft.jpg', 'Darkone', 'CC BY-SA 2.5'],
  ['Touchpad', 'ASUS_ROG_Strix_G15_(G513QY-HQ012T)-top_keyboard_touchpad_PNr°0889.jpg', 'D-Kuru', 'CC BY-SA 4.0'],
  ['Microphone', 'Shure_mikrofon_55S.jpg', 'Holger.Ellgaard', 'CC BY-SA 3.0'],
  ['Webcam', 'Logicool_StreamCam_(cropped).jpg', 'Masahiko OHKUBO', 'CC BY 2.0'],
  ['Scanner', 'Epson_V850_scanner_open_20230920.jpg', 'Santeri Viinamäki', 'CC BY-SA 4.0'],
  ['Barcode scanner', 'Honeywell_4600g-8665.jpg', 'Raimond Spekking', 'CC BY-SA 4.0'],
  ['Game controller', 'Nintendo-Switch-Pro-Controller-FL.jpg', 'Evan-Amos', 'Public domain'],
  ['Hard disk drive', 'ST3320620AS.jpg', 'User5515', 'CC0'],
  ['External hard drive', 'Samsung_S2_Portable_320GB_(3).jpg', 'Ryse93', 'CC BY-SA 4.0'],
  ['Pen drive', 'SanDisk-Cruzer-USB-4GB-ThumbDrive.jpg', 'Evan-Amos', 'Public domain'],
  ['Memory cards', 'Memory-card-comparison.jpg', 'Evan-Amos', 'Public domain'],
  ['DVD', 'DVD-R_bottom-side.jpg', 'Wanted, Ochro', 'Public domain'],
  ['ROM chip', 'MSI_MS-6119_BX2_Motherboard_-_AWARD_BIOS_W619_MD10.jpg', 'Mister rf', 'CC BY-SA 4.0'],
  ['Printer', 'Canon_PIXMA_TS207_Printer_picture.jpg', 'Paowee', 'CC BY-SA 4.0'],
  ['Speakers', 'Logitech-usb-speakers.jpg', 'Evan-Amos', 'Public domain'],
  ['Headphones', 'Słuchawki_referencyjne_K-701_firmy_AKG.jpg', 'muzyczny.pl', 'CC BY-SA 4.0'],
]

export default function Credits() {
  return (
    <div className="container l2-credits">
      <details>
        <summary>Photo credits</summary>
        <p>Hardware photos from Wikimedia Commons, resized and cropped. Click a name to see the original and its licence. Company logos are trademarks of their owners.</p>
        <ul>
          {photos.map(([what, file, author, lic]) => (
            <li key={file}>
              <a href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`} target="_blank" rel="noreferrer">
                {what}
              </a>
              : {author}, {lic}
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
