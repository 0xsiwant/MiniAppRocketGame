import React, { useState, useEffect } from "react";
import { Carousel } from 'react-responsive-carousel';
import { useAtom } from "jotai";
import FriendRanking from "../component/atom/friend-ranking.jsx";
import PannelScore from "../component/atom/PannelScore";
import TabButton from "../component/atom/tab-button";
import ArrowLeft from "../component/svg/arrow-left.jsx";
import ArrowRight from "../component/svg/arrow-right.jsx";
import { avatar } from "../assets/avatar";
import { RANKINGDATA } from "../utils/globals.js";
import { REACT_APP_SERVER } from "../utils/privateData.js";
import { userData } from "../store/userData.jsx";
import { Img } from "../assets/image";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "../css/userInfo.css"


const UserInfo = () => {
  const [user,] = useAtom(userData);
  const [tabId, setTabId] = useState(1);
  const [rankingIndex, setRankingIndex] = useState(0);
  const [friendData, setFriendData] = useState([])
  const serverUrl = REACT_APP_SERVER
  const statsList = [
    {
      src: "coin-y.svg",
      amount: user.Balance,
      id: 1
    },
    {
      src: "token.png",
      amount: "0",
      id: 2
    }
  ]

  const avatarData = [avatar.avatarBeginner, avatar.avatarPilot, avatar.avatarExplorer,
    avatar.avatarAstronaut, avatar.avatarCaptain, avatar.avatarCommander, avatar.avatarAdmiral,
    avatar.avatarLegend, avatar.avatarMasterOfTheUniverse, avatar.avatarGodOfSpace]

  const rankingItems = RANKINGDATA.map((data, index) => {
    return (
      <div className="w-full" key={index}>
        <p>Ranking:{data}</p>
      </div>

    )
  })

  const rankingNext = () => {
    setRankingIndex(((rankingIndex + 1) + RANKINGDATA.length) % RANKINGDATA.length);
  }
  const rankingPrev = () => {
    setRankingIndex(((rankingIndex - 1) + RANKINGDATA.length) % RANKINGDATA.length);
  }

// eslint-disable-next-line no-self-assign
  useEffect(() => {
    const webapp = window.Telegram.WebApp.initDataUnsafe;
    let isMounted = true
    if (webapp) {

      const realName = webapp["user"]["first_name"] + " " + webapp["user"]["last_name"];
      const userName = webapp["user"]["username"];

      const headers = new Headers()
      headers.append('Content-Type', 'application/json')
      fetch(`${serverUrl}/users_info`, { method: 'POST', body: JSON.stringify({ historySize: 100, realName: realName, userName: userName }), headers })
        .then(res => Promise.all([res.status, res.json()]))
        .then(([status, data]) => {
          if (isMounted) {
            try {
              const myData = data.allUsersData
                .sort((a, b) => b.balance.real - a.balance.real)
                .map((i, index) => { i.rank = index + 1; return i })
                .filter(i => (i.ranking === RANKINGDATA[rankingIndex] && i.name !== realName)) //--------------------------

              const filterData = myData.map((data) => {
                return {
                  url: "john.svg",
                  name: data.name,
                  label: data.ranking,
                  rate: RANKINGDATA.indexOf(user.Ranking) + 1,
                  id: data.balance.real,
                  ranking: data.rank
                }
              })
              setFriendData(filterData)

            } catch (e) {
              // eslint-disable-next-line no-self-assign
              document.location.href = document.location.href
            }
          }
        })
      return () => { isMounted = false }

    }

  }, [rankingIndex])
  return (
    <div className="flex flex-col gap-4 items-center text-white text-base">
      <div className="font-semibold">{user.RealName}</div>
      <TabButton tabList={statsList} tabNo={tabId} setTabNo={setTabId} />
      <div className="flex flex-col gap-4 overflow-auto w-full " style={{ height: "calc(100vh - 200px)" }}>
        <div className="flex gap-[41px] text-blueFaded text-sm justify-center">

          <div>Level <span className="text-white">{RANKINGDATA.indexOf(user.Ranking) + 1}/10</span></div>
          <div>Rank <span className="text-white">{user.Rank}</span></div>

        </div>
        <div className="flex flex-col items-center gap-2">
          <img src={avatarData[RANKINGDATA.indexOf(user.Ranking)]} width="200px" height="200px" className="max-w-[200px] h-[200px]" alt="avatar" />
          <div className="rounded-[8px] border-[3px] border-[#56D0EA] py-2 w-[200px] text-center text-white">
            {user.Ranking}
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <div className="w-1/2">
            <PannelScore img={Img.agree} text2={"Won"} text3={user.GameWon} className="w-full py-[10px]" />
          </div>
          <div className="w-1/2">
            <PannelScore img={Img.disagree} text2={"Lost"} text3={user.GameLost} className="w-full py-[10px]" />
          </div>
        </div>

        <div className="h-9 text-center ">
          <Carousel
            showThumbs={false} showStatus={false} showIndicators={false} infiniteLoop={true}
            renderArrowNext={(clickHandler, hasNext, labelNext) => (hasNext && <div
              type="button" aria-level={labelNext} className="next flex"
              onClick={() => {
                clickHandler()
                rankingNext()
              }}>
              <ArrowRight className={"w-4 h-4 m-auto"} />
            </div>)}
            renderArrowPrev={(clickHandler, hasPrev, labelPrev) => (hasPrev && <div
              type="button" aria-level={labelPrev} className="prev flex"
              onClick={() => {
                clickHandler()
                rankingPrev()
              }}>
              <ArrowLeft className={"w-4 h-4 m-auto"} />
            </div>)}
          >
            {rankingItems}
          </Carousel>
        </div>


        <div className=" w-full" style={{ height: "calc(100vh - 630px)" }}>
          <div className="flex flex-col gap-2 pb-8">
            {
              friendData.length > 0 ?
                friendData.map((_data, _index) => <FriendRanking data={_data} key={_index} />)
                : <div className="text-center text-[#ACC1D9]">No {RANKINGDATA[rankingIndex]}s yet.</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo