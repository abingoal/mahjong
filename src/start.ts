import * as debug from "debug";
const log = debug("mahjong:*");

class Mahjong {
  public Start() {
    const users = [
      [{ mahjong: [], peng: [], gang: [], banker: true }],
      [{ mahjong: [], peng: [], gang: [], banker: true }],
      [{ mahjong: [], peng: [], gang: [], banker: true }],
      [{ mahjong: [], peng: [], gang: [], banker: true }]
    ];
    log("%s", "--> 开始游戏");
    log("%s", "--> 初始化牌");
    // 定义麻将存储数组
    const mahjongData = [];
    // 加入麻将
    for (let i = 0; i < 3; i++) {
      // 加入 万
      for (let j = 1; j <= 9; j++) {
        mahjongData.push(j);
      }
      // 加入条
      for (let j = 11; j <= 19; j++) {
        mahjongData.push(j);
      }
      // 加入筒
      for (let j = 21; j <= 29; j++) {
        mahjongData.push(j);
      }
      /*
      // 加入字 东西南北风
      for (let j = 31; j <= 37; j++) {
        mahjongData.push(j);
      }
      // 加入中發白
      for (let j = 41; j <= 45; j++) {
        mahjongData.push(j);
      }
      */
    }
    // 打乱顺序
    mahjongData.sort(() => {
      return 0.5 - Math.random();
    });
    log("%o", mahjongData);
    log("--> 掷骰子");
    const num1 = Math.floor(Math.random() * 6 + 1);
    const num2 = Math.floor(Math.random() * 6 + 1);
    log("%s", `[🎲：${num1}] [🎲：${num2}]`);
    log("%s", "--> 选择庄家");
    touzi(num1 + num2);
    log("%s", "--> 开始发牌");
    log("%s", "--> 顺时针发牌");
    log("%s", "--> 发牌结果");
    for (const d of users) {
      d[0].mahjong = mahjongData
        .splice(0, d[0].banker ? 14 : 13)
        .sort((a, b) => {
          return a - b;
        });
      mahjongData.slice(0, d[0].banker ? 14 : 13);
    }
    // log(JSON.stringify(users));
    // log("%s", "--> 庄家先出牌");
    // log("%s", "--> 选出“将”牌方案");
    // const zhuangPai = users[calNum][0].mahjong;
    // const withJiangPai = xuanJiang(zhuangPai);
    // log(withJiangPai);
    // log("判断庄家可胡");
    // canHu(withJiangPai);
    for (let i = 0, j = users.length; i < j; i++) {
      log(`判断${touzi(i)}可胡`);
      canHu(xuanJiang(users[i][0].mahjong));
    }
  }
}
function touzi(num: number) {
  let title = "";
  const calNum = num % 4;
  switch (calNum) {
    case 0:
      title = "北家庄";
      // log("%s", "北家庄");
      break;
    case 1:
      title = "东家庄";
      // log("%s", "东家庄");
      break;
    case 2:
      title = "南家庄";
      // log("%s", "南家庄");
      break;
    case 3:
      title = "西家庄";
      // log("%s", "西家庄");
      break;
  }
  return title;
}
/**
 * 是否可胡
 *
 * @param {number[]} pai
 */
function canHu(pai: any[]) {
  if (pai.length > 0) {
    for (const p of pai) {
      // 首先满足牌数正确
      if ((p.jiang.length + p.pai.length) % 3 === 2) {
        log("*".repeat(50));
        log(`将：[${p.jiang}], 牌：[${p.pai}]`);
        log(huPaiPanDing(p.pai) ? "该组合胡了" : "该组合不可胡");
        log("*".repeat(50));
      } else {
        log("%s", "牌型不符");
      }
    }
  } else {
    log("没牌胡你妹");
  }
}
/**
 * 选出所有将
 *
 * @param {number[]} pai
 */
function xuanJiang(pai: number[], index = 0, jiangPai: any[] = []) {
  const tempPai = pai.slice();
  for (let i = index, j = pai.length; i < j; i++) {
    // 如果挨着两张牌相同，则当做“将”过滤出来
    if (pai[i] === pai[i + 1]) {
      const tempData = { jiang: [pai[i], pai[i + 1]], pai: [] };
      tempPai.splice(i, 2); // 把“将”从数组中移除
      tempData.pai = tempPai;
      jiangPai.push(tempData);
      return xuanJiang(pai, i + 2, jiangPai);
    }
  }
  return jiangPai;
}
/**
 * 胡牌判定
 *
 * @param {any} pai
 * @returns
 */
function huPaiPanDing(pai) {
  // 余牌是否大于0
  if (pai.length === 0) {
    return true;
  }
  // 前三张牌相同
  if (pai[0] === pai[1] && pai[0] === pai[2]) {
    pai.splice(0, 3);
    return huPaiPanDing(pai);
  }
  // 余牌第一张与后面牌三张连续
  const p1 = pai[0];
  const p2 = pai[0] + 1;
  const p3 = pai[0] + 2;
  if (pai.includes(p1) && pai.includes(p2) && pai.includes(p3)) {
    pai.splice(pai.indexOf(p1), 1);
    pai.splice(pai.indexOf(p2), 1);
    pai.splice(pai.indexOf(p3), 1);
    return huPaiPanDing(pai);
  } else {
    // xuanJiang();
  }
  return false;
}
/**
 * 是否可杠
 *
 * @param {number[]} pai
 */
function canGang(pai: number[], num: number) {
  if (paiNums(pai, num) >= 3) {
    return true;
  }
  return false;
}
/**
 * 是否可碰
 *
 * @param {number[]} pai
 */
function canPeng(pai: number[], num: number) {
  if (paiNums(pai, num) >= 2) {
    return true;
  }
  return false;
}
/**
 * 计算数组中某个元素的个数
 *
 * @param {number[]} pai
 * @param {number} num
 * @returns
 */
function paiNums(pai: number[], num: number) {
  const map = {};
  for (let i = 0, j = pai.length; i < j; i++) {
    const ai = pai[i];
    if (!map[ai]) {
      map[ai] = 1;
    } else {
      map[ai]++;
    }
  }
  return map[num];
}
export default Mahjong;

// 思路
/*
1.首先找出所有包含一对的情形，移除对子（注意去重），记下剩余牌的所有集合为Tn;
2.针对每个Tn中的数组尝试移除一个顺子，成功转到2，失败到3。
3.针对每个Tn中的数组尝试移除一个刻子（DDD），成功转到2。
4.若当前的数组的数量变为0，则表示，当前的方案可以胡牌。
2,3,4可以作为一个check_3n(检测是否满足N * ABC + M *DDD)的函数，递归调用即可。
*/

// N * ABC + M *DDD + EE 胡牌形式
