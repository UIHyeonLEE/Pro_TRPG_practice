import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.attackPow = Math.floor(Math.random() * 6) + 20;
    const dmg = this.attackPow;
    this.defensePow = 3;
    return dmg;
  }

  attack(monster) {
    // 플레이어의 공격
    const dmg = this.attackPow;
    monster.hp -= dmg;
    return dmg;
  }

  defense(){
    return this.defensePow;
  }
}

class Monster {
  constructor(stage) {
    this.hp = 100 + stage * 20; 
    this.attackPow = 4 + stage;
  }

   attack(player) {
    // 몬스터의 공격
    const dmg = this.attackPow ;
    player.hp -= dmg;
    return dmg;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(chalk.cyanBright(`| Stage: ${stage} |`) +
    chalk.blueBright(
      `\n| 플레이어 HP: ${player.hp} 플레이어 DEF: ${player.defensePow} 플레이어 ATK: ${player.attackPow}|`,
    ) +
    chalk.redBright(
      `\n| 몬스터 HP: ${monster.hp} 몬스터 ATK: ${monster.attackPow}|`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while(player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 연속 공격한다 3. 방어한다. 4. 아무것도 하지않는다. 5.도망간다.`,
      ),
    );

    const choice = readlineSync.question('당신의 선택은? ');
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

    let monsterDmg; 

    // 플레이어의 선택에 따라 다음 행동 처리
    switch(choice){
        case '1':
            const playerDmg = player.attack(monster);
            logs.push(chalk.green(`플레이어가 ${playerDmg} 피해를 입혔습니다.`));
            break;
        case '2':
            const Additionaldmg = player.attack(monster)*2;
            monster.hp -= Additionaldmg;
            logs.push(chalk.green(`플레이어가 연속 공격으로 ${Additionaldmg}피해를 입혔습니다.`));
            break;

        case '3':
          monsterDmg = Math.max(monster.attack(player) - player.defense(), 0);
          player.hp -= monsterDmg;

          const reflectDmg = player.defense();  
          monster.hp -= reflectDmg;
          logs.push(chalk.white(`플레이어가 방어하여 ${player.defense()}만큼 피해를 줄였습니다.`));
          logs.push(chalk.red(`몬스터가 방어 후 ${monsterDmg} 피해를 입혔습니다.`));
          logs.push(chalk.green(`플레이어가 방어 후 몬스터에게 ${reflectDmg} 반격 데미지를 입혔습니다.`));
          break;
            
        case '4':
            logs.push(chalk.red(`턴을 넘깁니다.`));
            break;

        case '5':
            logs.push(chalk.red(`도망갑니다.`));
            if( stage === 10 ){
              readlineSync.question(chalk.red(`10 스테이지에서는 도망칠 수 없습니다! (엔터 키를 누르세요.)`));
            }
            return;

        default:
            console.log(chalk.red(`다시 선택해주세요!`));
            break;
    }

    
    if (choice !== '3') {
      monsterDmg = monster.attack(player);
      logs.push(chalk.red(`몬스터가 ${monsterDmg} 피해를 입혔습니다.`));
    }

    if(player.hp <= 0){
        console.log(chalk.red(`플레이어가 패배했습니다!`));
      }else if(monster.hp <= 0){
        console.log(chalk.blue(`몬스터를 처치했습니다!`));
      }
  }

};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    if (player.hp > 0 && monster.hp <= 0) {
      if (stage === 10) {
        console.log(chalk.yellow(`10 스테이지를 클리어했습니다!`));
        readlineSync.question(chalk.magenta(`엔터를 눌러 종료`));
        break; // 게임 종료
      } else {
        stage++;
        player.hp += 50; // 플레이어 HP 50 회복
        console.log(chalk.yellow(`스테이지를 클리어했습니다! 플레이어의 HP가 50 회복되었습니다. 현재 HP: ${player.hp}`));
        readlineSync.question(chalk.magenta(`엔터를 눌러 다음 스테이지로 이동하세요!`));
      }
    } else if (player.hp > 0 && monster.hp > 0 && stage < 10) {
      stage++;
      console.log(chalk.yellow(`도망에 성공하여 다음 스테이지로 넘어갑니다! 대신 플레이어의 HP가 회복되지 않습니다!`));
      readlineSync.question(chalk.magenta(`엔터를 눌러 다음 스테이지로 이동하세요!`));
    } else if (player.hp <= 0) {
      console.log(chalk.red(`플레이어가 패배했습니다! 게임 종료`));
      break; // 게임 종료
    }
  }
}
