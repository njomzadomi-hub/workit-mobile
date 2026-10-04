import*as ImagePicker from'expo-image-picker';
import{File}from'expo-file-system';
import{commitAvatar,getAvatarUploadUrl}from'./api';
import{supabase}from'./supabase';

const MAX_AVATAR_BYTES=10*1024*1024;
export async function pickAndUploadAvatar(){
 const permission=await ImagePicker.requestMediaLibraryPermissionsAsync();
 if(!permission.granted)throw new Error('Photo access is needed to choose a profile photo.');
 const pick=await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.Images,allowsEditing:true,aspect:[1,1],quality:.85});
 if(pick.canceled)return null;
 const asset=pick.assets?.[0];if(!asset?.uri)return null;
 if(asset.fileSize&&asset.fileSize>MAX_AVATAR_BYTES)throw new Error('Photo must be under 10 MB.');
 const contentType=asset.mimeType||'image/jpeg';const slot=await getAvatarUploadUrl(contentType);
 const bytes=await new File(asset.uri).arrayBuffer();if(bytes.byteLength>MAX_AVATAR_BYTES)throw new Error('Photo must be under 10 MB.');
 const{error}=await supabase.storage.from('workit-avatars').uploadToSignedUrl(slot.path,slot.token,bytes,{contentType,upsert:false});if(error)throw error;
 const updated=await commitAvatar(slot.path);return updated.avatar_url||slot.public_url||null;
}
