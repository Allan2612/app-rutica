import { memo } from 'react';
import { View, Text } from 'react-native';
import Toast from 'react-native-toast-message';

export const ProfileToastConfig = memo(function ProfileToastConfig() {
    return (
        <Toast
            config={{
                success: (props) => (
                    <View style={{
                        backgroundColor: '#1a1a1a',
                        padding: 16,
                        borderRadius: 12,
                        borderLeftWidth: 4,
                        borderLeftColor: '#10b981',
                        marginHorizontal: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        elevation: 5,
                        minWidth: 300,
                    }}>
                        <Text style={{ color: '#10b981', fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
                            {props.text1}
                        </Text>
                        {props.text2 && (
                            <Text style={{ color: '#b3b3b3', fontSize: 14 }}>
                                {props.text2}
                            </Text>
                        )}
                    </View>
                ),
                info: (props) => (
                    <View style={{
                        backgroundColor: '#1a1a1a',
                        padding: 16,
                        borderRadius: 12,
                        borderLeftWidth: 4,
                        borderLeftColor: '#3b82f6',
                        marginHorizontal: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        elevation: 5,
                        minWidth: 300,
                    }}>
                        <Text style={{ color: '#3b82f6', fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
                            {props.text1}
                        </Text>
                        {props.text2 && (
                            <Text style={{ color: '#b3b3b3', fontSize: 14 }}>
                                {props.text2}
                            </Text>
                        )}
                    </View>
                ),
            }}
        />
    );
});
