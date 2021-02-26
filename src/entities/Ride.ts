import { rideStatus } from 'src/types/types';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
 } from 'typeorm'
import Chat from './Chat';
import User from './User';

@Entity()
class Ride extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  
  @Column(
    {type: "text", 
    enum: ["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"],
    default: "REQUESTING"
  })
  status: rideStatus;

  @Column({type: "text"})
  pickUpAddress: string;
  
  @Column({type: "double precision", default: 0})
  pickUpLat: number;
  
  @Column({type: "double precision", default: 0})
  pickUpLng: number;
  
  @Column({type: "text"})
  dropOffAddress: string;
  
  @Column({type: "double precision", default: 0})
  dropOffLat: number;
  
  @Column({type: "double precision", default: 0})
  dropOffLng: number;
  
  @Column({type: "double precision"})
  price: number;
  
  @Column({type: "text"})
  distance: string;
  
  @Column({type: "text"})
  duration: string;

  @ManyToOne(type => User, user => user.ridesAsPassenger)
  passenger: User;

  @Column({nullable: true})
  passengerId: number;

  @ManyToOne(type => User, user => user.ridesAsDriver, { nullable: true })
  driver: User;

  @Column({nullable: true})
  driverId: number;

  @OneToOne(type => Chat, chat => chat.ride)
  @JoinColumn()
  chat: Chat;

  @Column({nullable: true})
  chatId: number;

  @CreateDateColumn() createAt: string;
  @UpdateDateColumn() updateAt: string;
}

 export default Ride;