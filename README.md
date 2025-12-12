[![Website](https://img.shields.io/website?url=https%3A%2F%2Fsplitkeyboard.gallery%2F)](https://splitkeyboard.gallery/)
![GitHub License](https://img.shields.io/github/license/NTK-studio/split-keyboard-gallery?color=green)
[ ![Discord](https://img.shields.io/discord/1435326750799433919?logo=discord&color=%235865F2)](https://discord.gg/myEkxF7rhV)

# Split Keyboards

This is an interactive gallery of split (and other) keyboards, visible at https://splitkeyboard.gallery/ .

See [about](https://splitkeyboard.gallery/) for more details.

## TODO

- [x] gallery page
- [x] embed card
- [x] permalinks
- [ ] closing lightbox on esc
- [ ] separate links to: electronics, case, product page
- [ ] error modal when permalink couldn't be parsed
- [x] toggle to make the content take full width
- [ ] find missing images

## Contributions

Issues and pull requests to correct mistakes or add missing keyboards are welcome.

Minor variations on existing designs, created as a personal hobby board, are generally not worth including.

### Adding a new keyboard

Create a pull request with the following changes:

1. Add a new row in the [all_keyboards.csv file](assets/data/all_keyboards.csv) with the keyboard details - the first row contains the column headers.
  - make sure the content rows remain sorted alphabetically
2. Add a photo of the keyboard to the [assets/images/keyboards/](assets/images/keyboards/) folder - make sure the name of the file is aligned with the `Image` column in the CSV file.
  - The image should be reasonably big - hugo will resize it for thumbnails
  - `.webp` won't work, use `.jpg` or `.png`
3. Run hugo with `npm run dev` to check everything looks OK. If you don't have prerequisites installed, you can let the Github CI run and check the uploaded artifacts

### Classification

Keyboards are classified with filter tags, shown `like this` below:

### Physical layout
`traditional`
: A traditional ergonomic keyboard; the normal layout with a wedge in the middle, or in two parts.  These are in `traditional.csv`.

`ortho` (ortholinear)
: keys positioned in a grid or near-grid. (`ortho.csv`)

`ergo` (ergonomic)
: keys usually staggered by column rather than row, and almost always including thumb keys. (`ergo.csv`)

`dish` (dished)
: a shaped keyboard with thumbkeys and dishes or wells for the fingers. (`dish.csv`)

### Number of keys
The minimum and maximum number of keys supported by the keyboard.  For example, many traditional layouts support an additional key for ISO layout (next to Z), and the [ErgoDash](https://github.com/omkbd/ErgoDash) can be configured with 66-70 keys.

### Features
This is a list of features, which the user can either require, forbid, or not care about.

`split` or two halves
: two independent parts to the keyboard, rather than a `single` board.

Rotary `encoder`
: one or more knobs which can press keys, useful for volume up/down, page-up/page-down, etc.

`track` track ball/point/pad
: an integrated mouse (a laptop-style trackpoint, a trackpad or a larger trackball). This shows up as "Pointing Device" in the interface

`display`
: a display on the keyboard, which can show status (Caps Lock, current layer, macros etc)

`wireless`
: no wires!

### Availability
`massproduced`
: Reliably in-stock for immediate delivery
: Probably includes a GUI or other professional tool for configuring keyboard layout, macros etc

`assembled`
: Available for purchase pre-assembled and programmed
: To distinguish this from the following categories, it omits keyboards where individuals are willing to assemble a kit for others — otherwise there's little point to the filter.  A company should be willing to buy an `assembled` keyboard for an employee, but less likely to ask someone on Reddit to solder a `kit` for them.

`kit`
: A kit (circuit boards, cases, components etc) is available to purchase.

`source`
: Open source keyboards, where files defining the PCB and case are available.  May be available occasionally as part of a group buy.

`unavailable`
: The keyboard is no longer available, and was not open source, or the source files are no longer online.

### Website
Typically the place to purchase it (if mass-produced or not open source), or the source/information site otherwise.  I've avoided linking to particular shops selling kits, as some boards have many suppliers.


## License

From December 2025 onwards, this repository is licensed under `AGPL-3.0`. If you feel like your contributions prior to this date are misused, please get in touch.
