// ThinkPHP SQL语句生成器
import {formatDate, notEmpty} from "@/utils/globalMethod";

export class TpSqlBuilder {
  constructor(searchType, searchOption) {
    let list = []
    let builder = {
      equal: this.equalBuilder,
      mySubject: this.mySubjectBuilder,
      strLike: this.strLikeBuilder,
      notNone: this.strNotNoneBuilder,
      inIdArr: this.inIdArrBuilder,
      dateBetween: this.dateBetweenBuilder,
      datetimeBetween: this.datetimeBetweenBuilder,
    }; //映射当前可用构造器,对应当前已有方法(xxxBuilder)
    for (let type in builder) {
      if (Array.isArray(searchType[type])) {
        searchType[type].forEach(field => {
          if (notEmpty(searchOption[field])) list.push(builder[type](field, searchOption[field]))
        })
      }
    }
    return list;
  }

  /* 精确生成 */
  equalBuilder = (field, value) => {
    return [field, '=', value];
  }
  /* In查询生成 */
  inIdArrBuilder = (field, value) => {
    return [field, 'IN', value];
  }
  /* 模糊查询生成 */
  strLikeBuilder = (field, value) => {
    return [field, 'LIKE', `%${value}%`];
  }
  /* 模糊查询生成 */
  strNotNoneBuilder = (field, value) => {
    return [field, 'NOT NULL', value];
  }
  /* 日期范围查询生成 */
  dateBetweenBuilder = (field, value) => {
    if (notEmpty(value)) {
      let range = value
      if (range.length === 1 || (range.length === 2 && range[0]===range[1] ) ) {
        let nextDay = formatDate(new Date(new Date(range[0]).getTime() + 24 * 60 * 60 * 1000), false, 'YYYY-MM-DD')
        return [field, 'between', [range[0], nextDay]]
      } else if (range.length === 2) {
        return [field, 'between', (new Date(range[0]) < new Date(range[1])) ? range : range.reverse()]
      }
    }
  }
  /* 日期转时间范围查询生成 */
  datetimeBetweenBuilder = (field, value) => {
    if (notEmpty(value)) {
      let range = value
      if (range.length === 1 || (range.length === 2 && range[0]===range[1] ) ) {
        let datetimeStr = formatDate(range[0],false,'YYYY-MM-DD')
        return [field, 'between', [datetimeStr+' 00:00:00', datetimeStr+' 23:59:59']]
      } else if (range.length === 2) {
        let sortRangeStr = (new Date(range[0]) < new Date(range[1])) ? range : range.reverse()
        return [field, 'between', [sortRangeStr[0]+' 00:00:00',sortRangeStr[1]+' 23:59:59']]
      }
    }
  }
  /* 区间范围查询生成(1-4分) */
  mySubjectBuilder = (field, value) => {
    if (notEmpty(value)) {
      if(parseInt(value)===2){
        return [field, '<', 3]
      }else if(parseInt(value)===3){
        return [field, '>', 2]
      }
    }
  }
}

