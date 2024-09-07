import { createContext, PropsWithChildren, useContext, useEffect, useState} from "react";

import * as MediaLibrary from 'expo-media-library';


interface MediaContextValue {
  localAssets: MediaLibrary.Asset[];
  loadLocalAssets: () => void;
  hasNextPage: boolean;
}

const MediaContext = createContext<MediaContextValue>({
    localAssets: [],
    loadLocalAssets: () => {},
    hasNextPage: false
});

const MediaContextProvider = ({ children }: PropsWithChildren) => {



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
      after: endCursor !== null ? endCursor : undefined
    })
    console.log(assetsPage)
    setLocalAssets(prev => [...prev, ...assetsPage.assets]);
    setEndCursor(assetsPage.endCursor);
    setHasNextPage(assetsPage.hasNextPage);
    setLoading(false);
  }

    return (
        <MediaContext.Provider value={{ localAssets, loadLocalAssets, hasNextPage }}>
            {children}
        </MediaContext.Provider>
    )
}

export default MediaContextProvider

export const useMedia = () => useContext(MediaContext)
