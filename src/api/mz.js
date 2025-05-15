import {api} from "./server"

export const getServerData = async () => {
  const res = await api({
    url: '/proxy',
    method: 'get',
    headers: {
      'x-target-url': 'https://activity.zlongame.com/activity/cmn/gmt/getServerList.do'
    },
    params: {
      appId: 27
    }
  });
  const data = JSON.parse(res)?.data.filter((item)=>{
    return item.serverList.length>0
  })
  return data
};