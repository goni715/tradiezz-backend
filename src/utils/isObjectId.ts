import { Types } from "mongoose"

const isObjectId = (id: string) => {
    return Types.ObjectId.isValid(id) //true or false
}

export default isObjectId;