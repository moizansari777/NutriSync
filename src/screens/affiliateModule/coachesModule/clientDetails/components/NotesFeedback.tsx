import { View, Text, FlatList } from "react-native";
import React from "react";
import styles from "../styles";
import AppText from "../../../../../components/appText";

type NoteItem = {
  id: string;
  dateTime: string;
  notes: string;
};

const MOCK_NOTES: NoteItem[] = [
  { id: "1", dateTime: "12 Oct 2025", notes: "Some notes" },
  {
    id: "2",
    dateTime: "14 Oct 2025",
    notes: "Great consistency this week. Keep protein high and hydrate.",
  },
];

const NotesFeedback = () => {
  return (
    <View style={styles.notesCard}>
      <AppText allowFontScaling={false} style={styles.notesTitle}>Notes & Feedback</AppText>

      <FlatList
        data={MOCK_NOTES}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.notesList}
        ItemSeparatorComponent={() => <View style={styles.notesDivider} />}
        renderItem={({ item }) => (
          <View style={styles.notesRow}>
            <AppText allowFontScaling={false} style={styles.notesDate}>{item.dateTime}</AppText>
            <AppText allowFontScaling={false} style={styles.notesMessage}>{item.notes}</AppText>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.notesEmpty}>
            <AppText allowFontScaling={false} style={styles.notesEmptyText}>No notes yet.</AppText>
          </View>
        }
      />
    </View>
  );
};

export default NotesFeedback;
