import { useState, useEffect } from "react";
import CheckMark from "../svg/check-mark";
import LoadingSpinner from "../svg/loading-spinner";
import toast from "react-hot-toast";
import { REACT_APP_SERVER } from "../../utils/privateData";
import { useAtom } from "jotai";
import { userData } from "../../store";
import { Link } from "react-router-dom";

const serverUrl = REACT_APP_SERVER;



// const GenerateTask = (_task, _index, stateTask) => {

//   const [isClaim, setIsClaim] = useState(false);
//   const [user, setUser] = useAtom(userData);

//   const goClaim = () => {
//     // setIsClaim(true);
//     // const headers = new Headers()
//     // headers.append('Content-Type', 'application/json')
//     // fetch(`${serverUrl}/task_balance`, { method: 'POST', body: JSON.stringify({ userName: user.UserName, amount: _task.amount, task: _index }), headers })
//     //   .then(res => Promise.all([res.status, res.json()]))
//     //   .then(() => {
//     //     try {
//     //       toast(`${_task.amount} coins added to your balance`,
//     //         {
//     //           position: "top-center",
//     //           icon: <CheckMark />,
//     //           style: {
//     //             borderRadius: '8px',
//     //             background: '#7886A0',
//     //             color: '#fff',
//     //             width: '90vw'
//     //           },
//     //         }
//     //       )
//     //     } catch (e) {
//     //       // eslint-disable-next-line no-self-assign
//     //       document.location.href = document.location.href
//     //     }
//     //     setIsClaim(false)
//     //     stateTask()
//     //   })
//   }

//   return (
//     <></>
//   )
// }

const generateTask = () => {
  return (
    <>
    </>
  )
};

const TaskList = () => {
  let taskState = [];

  const [taskData, setTaskData] = useState([]);

  const [user,] = useAtom(userData);

  const stateTask = () => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    fetch(`${serverUrl}/task_perform`, { method: 'POST', body: JSON.stringify({ userName: user.UserName }), headers })
      .then(res => Promise.all([res.status, res.json()]))
      .then(([status, data]) => {

        try {
          const performtask = data.task.achieve_task
          const doneTask = data.task.done_task
          taskState = [0, 0, 0, 0, 0]
          performtask.map((item) => {
            taskState[item] = 1;
          })
          doneTask.map((item) => {
            taskState[item] = 2;
          })

          console.log(taskState)
          fetch(`${serverUrl}/get_task`, { method: 'POST', body: JSON.stringify({}), headers })
            .then(res => Promise.all([res.status, res.json()]))
            .then(([status, data]) => {
              console.log(data)
              try {
                setTaskData(prevState => {
                  let newState = [...prevState];
                  newState = data.task.map((item, index) => ({
                    src: item.src,
                    title: item.title,
                    amount: item.amount,
                    status: taskState[index],
                  }));
                  return newState;
                });
              } catch (e) {
                console.log(e);
              }
            })


        } catch (e) {
          // eslint-disable-next-line no-self-assign
          console.log(e);
        }
      })
  }
  console.log(taskData)

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      stateTask();
    }
    return () => { isMounted = false }
  }, [])

  console.log(taskData)
  return (
    <div className="flex flex-col gap-2 text-[14px] overflow-auto pb-4" style={{ height: "calc(100vh - 200px)" }}>
      {
        taskData.map((_task, _index) => generateTask(_task, _index, stateTask))
      }
    </div>
  )
}

export default TaskList;