const gui = require('gui')

function RoundedCornerPath(painter, r, radius) {
  const degrees = Math.PI / 180
  painter.beginPath()
  painter.arc({x: r.x + r.width - radius, y: r.y + radius},
              radius, -90 * degrees, 0)
  painter.arc({x: r.x + r.width - radius, y: r.y + r.height - radius},
              radius, 0, 90 * degrees)
  painter.arc({x: r.x + radius, y: r.y + r.height - radius},
              radius, 90 * degrees, 180 * degrees)
  painter.arc({x: r.x + radius, y: r.y + radius},
              radius, 180 * degrees, 270 * degrees)
  painter.closePath()
}

class AccountButton {
  constructor(accountsPanel, account) {
    this.accountsPanel = accountsPanel
    this.account = account
    this.active = false

    this.image = null
    this.textAttributes = {
      font: gui.Font.create('Helvetica', 35, 'normal', 'normal'),
      color: '#FFF',
      align: 'center',
      valign: 'center',
    }
    this.view = gui.Container.create()
    this.view.setMouseDownCanMoveWindow(false)
    this.view.setStyle({
      marginBottom: 10,
      width: 40,
      height: 40,
    })
    this.view.onMouseUp = () => {
      accountsPanel.chooseAccount(account)
    }
    this.view.onDraw = this.draw.bind(this)

    this.update()
  }

  update() {
    if (this.account.icon)
      this.image = gui.Image.createFromPath(this.account.icon)
    this.view.schedulePaint()
  }

  setActive(active) {
    this.active = active
    this.view.schedulePaint()
  }

  draw(view, painter, dirty) {
    // Rounded corner.
    const bounds = Object.assign(view.getBounds(), {x: 0, y: 0})
    RoundedCornerPath(painter, bounds, 10)
    painter.clip()
    // Icon.
    if (this.image) {
      painter.drawImage(this.image, bounds)
    } else {
      painter.setFillColor('#333')
      painter.fillRect(bounds)
      painter.drawText(this.account.name[0], bounds, this.textAttributes)
    }
    // Transparent mask.
    if (!this.active) {
      painter.setFillColor('#8FFF')
      painter.fillRect(bounds)
    }
  }
}

module.exports = AccountButton