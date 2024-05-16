import { RoomInfo } from "@/constants/types";
import { View , Text } from "react-native";


const ResultItem = ({ item }: { item: RoomInfo }) => {
    return (
        <View>
            <Text>{item.room_name}</Text>
        </View>
    );
}

export default ResultItem;