const Url = require('../../../Models/Url')
module.exports = MonthlyDashboard = async (req,res,next) => {

    /* https://docs.mongodb.com/manual/reference/operator/aggregation/month/#example */

    const monthNames = { '1': "Jan",'2':"Feb",'3':"Mar","4":"Apr","5":"May","6":"Jun","7":"Jul","8":"Aug","9":"Sep","10":"Oct","11":"Nov","12":"Dec"};
    const {year,month} = req.params
    const eachday = {}

    try{
        let result = await Url.aggregate(
            [
                {
                    $match:{"date":{'$gte': new Date(`${year}-${month}-01`), '$lt': new Date(`${year}-${month}-31`)}}
                }, 
                {
                    $project:
                    {
                        day: { $dayOfMonth: "$date" },
                    }
                },
                {
                    $group : {
                        _id : '$day',
                        count : {$sum : 1}
                    }
                }
            ]
        )
        /* Getting sorted List */
        let mon = monthNames[month];
        result.map((res)=>{

            if(eachday[`${mon} ${res._id}`] === undefined ){
                eachday[`${mon} ${res._id}`] = res.count
            } 
        })
        let month_sorted = Object.keys(eachday).sort().reduce((r, k) => (r[k] = eachday[k], r), {}); 
        
        return res.send({
            success : true,
            month_sorted
        })
    }catch(error){
        return res.status(401).json({
            success : false,
            error
        })
    }
}