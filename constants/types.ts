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
  
export enum RoomStatus {
    available = "available",
    occupied = "occupied",
    soon_occupied = "soon_occupied",
  }
export type RoomInfoV2 = RoomInfo & {
  status:  RoomStatus;
  time_left: number;
};
export type EditReservationModalProps = {
  reservationId: string;
  room_name: string;
  date: Date;
  start_time: Date;
  end_time: Date;
}

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
  
  
export interface AccountInfo {
    id: string;
    token: string;
    email: string;
    display_name: string;
    cookies: {};
}


export interface User {
  username: string;
  token: string;
}

export interface FullUser extends User {
  password: string;
}

export type Reservation = {
  id: string;
  startdate: string;
  starttime: string;
  enddate: string;
  endtime: string;
  columns: string[];
};

export type ReservationsResponse = {
  reservations: Reservation[];
};

export type LoginResponse = {
  success: boolean;
  error?: string;
};

export type ReservationData = {
  room_name: string;
  date: Date;
  start_time: Date;
  end_time: Date;
};
export type ReservationResponse = {
  success: boolean;
  error?: string;
};

export type ValidationErrorResponse = {
  detail: ValidationError[];
};

export type ValidationError = {
  loc: string[];
  msg: string;
  type: string;
};

interface ApiError {
  status_code: number;
  detail: string;
}

// Define success response interface
interface ApiResponseSuccess<T> {
  data: T;
}

export type LoginSuccessResponse = {
  access_token: string;
  token_type: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T>;



export type getRoomIdResponse = {
  room_id: number;
};


