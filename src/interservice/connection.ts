



export default class interConnection {
    async putReward(userId:string , point : number | undefined , reason : string) {
        let data = {reason : {reason : reason , point : 100} , userId : userId}
        const rawResponse = await fetch(`http://localhost:5000/interservice/put-new-point`, {
            method: 'PUT',
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        const response = await rawResponse.json()
        return response;
    }

    
}