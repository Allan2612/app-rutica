import { memo } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useThemedColors } from "@/hooks";
import { useEventForm } from '@/features/events/hooks/useEventForm';
import { EventFormView } from '@/components/events/EventFormView/EventFormView';
import { styles } from "@/components/events/EventFormView/styles";

export const EditEventScreen = memo(function EditEventScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    categories,
    event,
    loadingCategories,
    loadingEvent,
    formData,
    errors,
    updateField,
    handleSubmit,
    handleLocationSelect,
    isSubmitting,
    hasChanges,
  } = useEventForm(id);

  if (loadingEvent || loadingCategories) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.secondary },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!event) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.secondary },
        ]}
      >
        <Text style={[styles.title, { color: colors.text.primary }]}>
          No se encontró el evento
        </Text>
      </View>
    );
  }

  return (
    <EventFormView
      title="Editar Evento"
      subtitle="Modifica la información de tu evento"
      formData={formData}
      errors={errors}
      categories={categories}
      loadingCategories={loadingCategories}
      isSubmitting={isSubmitting}
      hasChanges={hasChanges}
      submitLabel="Guardar Cambios"
      onFieldChange={updateField}
      onLocationSelect={handleLocationSelect}
      onCancel={() => router.push("/(app)/(tabs)/manage/events")}
      onSubmit={handleSubmit}
    />
  );
});
