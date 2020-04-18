import {
  Entity, Column, PrimaryGeneratedColumn, Generated,
} from 'typeorm';

@Entity({ name: 'appointments' })
class Appointment {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string;

  @Column('timestamp with time zone')
  date: Date;
}

export default Appointment;
