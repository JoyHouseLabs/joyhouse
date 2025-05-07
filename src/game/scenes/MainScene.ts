import Phaser from 'phaser'

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' })
  }

  preload() {
    // 加载游戏资源
    this.load.image('logo', './assets/logo.png')
  }

  create() {
    // 创建游戏对象
    const logo = this.add.image(400, 300, 'logo')
    
    // 添加一些简单的动画
    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      repeat: -1
    })
  }

  update() {
    // 游戏循环更新
  }
}

// 创建游戏配置
export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: MainScene,
  parent: 'game-container',
  backgroundColor: '#2d2d2d',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}
