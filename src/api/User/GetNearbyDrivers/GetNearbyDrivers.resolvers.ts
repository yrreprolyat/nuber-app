import { Resolvers } from "src/types/resolvers";
import { Between, getRepository } from "typeorm";
import User from "../../../entities/User";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetNearbyDrivers: privateResolver(async (_, __, { req }) => {
      const user: User = req.user;
      const { lastLat, lastLng } = user;
      try {
        const drivers: User[] = await getRepository(User).find({
          isDriving: true,
          lastLat: Between(lastLat - 0.05, lastLat + 0.05),
          lastLng: Between(lastLng - 0.05, lastLng + 0.05)
        });
        return {
          ok: true,
          error: null,
          drivers
        }
      } catch(error) {
        return {
          ok: false,
          error: error.message,
          drivers: null
        }
      }
    })
  }
}

export default resolvers;