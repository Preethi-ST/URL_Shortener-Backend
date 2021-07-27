//const DashboardMonthly = require('../../../Models/DashboardYearly');
const Url = require('../../../Models/Url');
const MonthlyDashboard = require('./MonthlyDashboard');
module.exports = YearlyDashboard = async (req,res,next) => {
    /* https://docs.mongodb.com/manual/reference/operator/aggregation/month/#example */
    const monthNames = { "1": "Jan",'2':"Feb","3":"Mar","4":"Apr","5":"May","6":"Jun","7":"Jul","8":"Aug","9":"Sep","10":"Oct","11":"Nov","12":"Dec"};
    const monthly = {};
    const {year} = req.params
    try{
        let result = await Url.aggregate(
            [
                {
                    $match: {"date":{'$gte': new Date(`${year}-01-01`), '$lt': new Date(`${year}-12-31`)}}
                }, 
                {
                    $project:
                    {
                        month: { $month: "$date" }
                    }
                },
                {
                    $group : {
                        _id : '$month',
                        count : {$sum : 1}
                    }
                }
            ]
        )
        /* Getting sorted List */
        result.map((res)=>{
            if(monthly[monthNames[`${res._id}`]] === undefined){
                monthly[monthNames[`${res._id}`]] = res.count
            }
        })
        const obj = {}
        Object.values(monthNames).map((month,index) => {
            if(!monthly[month]){
                obj[month] = 0
            }else{
                obj[month] = monthly[month]
            }
        })
        return res.status(200).send({
            success : true,
            data : obj,
        })
    }catch(error){
        return res.status(401).json({
            success : false,
            error
        })
    }
        
}