const PUBLIC_CONTENT_SYNC_EVENT = "environomics:public-content-updated";
const PUBLIC_CONTENT_SYNC_STORAGE_KEY = "environomics-public-content-sync";
const PUBLIC_CONTENT_SYNC_CHANNEL = "environomics-public-content";

let broadcastChannel = null;

function getBroadcastChannel() {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }

  if (!broadcastChannel) {
    broadcastChannel = new BroadcastChannel(PUBLIC_CONTENT_SYNC_CHANNEL);
  }

  return broadcastChannel;
}

export function notifyPublicContentUpdated() {
  const payload = {
    updatedAt: Date.now(),
  };

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PUBLIC_CONTENT_SYNC_EVENT, { detail: payload }));

    try {
      window.localStorage.setItem(
        PUBLIC_CONTENT_SYNC_STORAGE_KEY,
        JSON.stringify(payload)
      );
    } catch {
      // Ignore storage write issues and still notify the current tab.
    }
  }

  getBroadcastChannel()?.postMessage(payload);
}

export function subscribeToPublicContentUpdates(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleWindowEvent = () => {
    callback();
  };

  const handleStorageEvent = (event) => {
    if (event.key === PUBLIC_CONTENT_SYNC_STORAGE_KEY && event.newValue) {
      callback();
    }
  };

  const channel = getBroadcastChannel();
  const handleChannelMessage = () => {
    callback();
  };

  window.addEventListener(PUBLIC_CONTENT_SYNC_EVENT, handleWindowEvent);
  window.addEventListener("storage", handleStorageEvent);
  channel?.addEventListener("message", handleChannelMessage);

  return () => {
    window.removeEventListener(PUBLIC_CONTENT_SYNC_EVENT, handleWindowEvent);
    window.removeEventListener("storage", handleStorageEvent);
    channel?.removeEventListener("message", handleChannelMessage);
  };
}
