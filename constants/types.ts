export type RoomInfo = {
    room_name: string;
    room_size: number;
    building: string;
    campus: string;
    equipment: string;
    longitude: number;
    latitude: number;
    entrance_latitude: number;
    entrance_longitude: number;
    description: string;
    first_come_first_served: boolean;
    floor_level: number;
    stair: string;
  };
  
export type RoomData = {
    building?: RoomInfo[];
    room_name?: RoomInfo[];
    room_size?: RoomInfo[];
    floor_level?: RoomInfo[];
    first_come_first_served?: RoomInfo[];
  };
  
export type TimeSlot = {
    start_date: string;
    start_time: string;
    end_time: string;
    end_date: string;
  };
  