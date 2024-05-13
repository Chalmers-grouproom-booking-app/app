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

export type FilterData = {
  room_size: Interval | null;
  building: BuildingGroup | null;
  equipment: string[];
  first_come_first_served: number | null;
};

export type Interval = {
  lower : number;
  upper : number;
};

export type User = {
  username : string;
  password : string;
  cookie : string;
};

export type BuildingGroup = {
  name: string;
  label?: string;
  subBuildings?: BuildingGroup[];
};