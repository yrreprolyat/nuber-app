import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
 } from 'typeorm'
import Message from './Message';
import Ride from './Ride';
import User from './User';

@Entity()
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @OneToMany(type => Message, message => message.chat)
  messages: Message[]

  @ManyToOne(type => User, user => user.chatsAsPassenger)
  passenger: User;

  @Column({nullable: true})
  passengerId: number;

  @ManyToOne(type => User, user => user.chatsAsDriver)
  driver: User;

  @Column({nullable: true})
  driverId: number;

  @OneToOne(type => Ride, ride => ride.chat)
  ride: Ride;

  @Column({nullable: true})
  rideId: number;

  @CreateDateColumn() createAt: string;
  @UpdateDateColumn() updateAt: string;
}

 export default Chat;