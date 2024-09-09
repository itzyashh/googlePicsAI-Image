import { createContext, PropsWithChildren, useContext, useEffect, useState} from "react";

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer'
import { supabase } from "~/utils/supabase";
import { useAuth } from "./AuthProvider";
import mime from 'mime';



interface MediaContextValue {
  localAssets: MediaLibrary.Asset[];
  loadLocalAssets: () => void;
  hasNextPage: boolean;
  findAsset: (id: string) => MediaLibrary.Asset | undefined;
  uploadAsset?: (asset: MediaLibrary.Asset) => void;
}

const MediaContext = createContext<MediaContextValue>({
    localAssets: [],
    loadLocalAssets: () => {},
    hasNextPage: false,
    findAsset: () => undefined,
    uploadAsset: () => {},
});

const MediaContextProvider = ({ children }: PropsWithChildren) => {

  const { user } = useAuth();

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [localAssets, setLocalAssets] = useState<MediaLibrary.Asset[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (permissionResponse?.status !== 'granted') {
      requestPermission();
    }

  }, []);

  useEffect(() => {

    if (permissionResponse?.status === 'granted') {
      console.log('Permission granted');
      loadLocalAssets();
    }

  }, [permissionResponse]);

  const loadLocalAssets = async () => {

    if (loading || !hasNextPage) {
      return;
    }
    setLoading(true);
    const assetsPage = await MediaLibrary.getAssetsAsync({
      first: 40,
      after: endCursor !== null ? endCursor : undefined
    })
    console.log(assetsPage)
    setLocalAssets(prev => [...prev, ...assetsPage.assets]);
    setEndCursor(assetsPage.endCursor);
    setHasNextPage(assetsPage.hasNextPage);
    setLoading(false);
  }

  const findAsset = (id: string) => {
    return localAssets.find(asset => asset.id === id);
    }

  const uploadAsset = async (asset: MediaLibrary.Asset) => {
    const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);

    if (assetInfo.localUri === undefined) {
      return;
    }
    const base64String = await FileSystem.readAsStringAsync(assetInfo.localUri, { encoding: FileSystem.EncodingType.Base64 });
    const arrayBuffer = decode(base64String);

    await supabase.storage.from('assets')
    .upload(`${user?.id}/${assetInfo.filename}`, arrayBuffer, {
      contentType: mime.getType(assetInfo.filename) ?? 'image/jpeg',
      upsert: true
    })

  }


    return (
        <MediaContext.Provider value={{ localAssets, loadLocalAssets, hasNextPage, findAsset, uploadAsset }}>
            {children}
        </MediaContext.Provider>
    )
}

export default MediaContextProvider

export const useMedia = () => useContext(MediaContext)
