export  enum Location {
    Johanneberg = 'Johanneberg',
    Lindholmen = 'Lindholmen',
}

export enum RoomSize {
    Small = '0_5',
    Medium = '6_10',
    Large = '12_20',
}

export const roomSizeValues = ['0_5', '6_10', '12_20'];

export const roomSizeMapping = {
    Small: RoomSize.Small,
    Medium: RoomSize.Medium,
    Large: RoomSize.Large
};

export enum Equipment {
    Whiteboard = 'Whiteboard',
    Display = 'digital skärm',
}
export type PanelFilter = {
    selectedLocation: Location;
    selectedRoomSize: RoomSize;
    selectedEquipment: Equipment[];
};