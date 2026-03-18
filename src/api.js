import axios from "axios";

// export const getAPI= async(payload)=>{
//     try{
//         const response = await axios.get(payload.url+ `${payload.id? payload.id: ""}`,
//             headers:{
//                 Authorization: `Bearer ${localStorage.getItem("Token")}`,

//             },
//             params:{
//                     ...payload?.params,
//             },
//         );
//         return response.data;
//     }
// }

export const getAPICallFunction = async (payload) => {
  try {
    const response = await axios.get(
      payload.url + `${payload.id ? payload.id : ""}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("udsToken")}`,
          "ngrok-skip-browser-warning": "skip-browser-warning",
        },
        params: {
          ...payload?.params,
        },
      },
    );
    return response.data;
  } catch (e) {
    if (
      e.response.data.status.code === 401 ||
      e.response.data.status.code === 403
    ) {
      localStorage.removeItem("udsToken");
      localStorage.removeItem("useFeedbackStore");
      window.location.href = "/";
      toast.error("Error occured please login");
    } else {
      if (e.code === "ERR_NETWORK") {
        toast.error("Network error");
      } else {
        toast.error(e.response.data.status.message);
      }
    }
    return e.response;
  }
};
