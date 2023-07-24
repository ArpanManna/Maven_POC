import { getUserDetails, initializeDispute } from '@/utils/service';
import { useWeb3 } from '@3rdweb/hooks';
import { Dialog, Transition } from '@headlessui/react'
import { Input } from 'antd'
import { Fragment, useCallback, useState } from 'react'
import Spinner from './Spinner';
import { TransactionToastMessage } from './Toast';
import { useContextState } from '@/context';
import { useRouter } from 'next/router';

export default function Modal({ modalStatus, setModalStatus, projectId }) {
  const [reason, setReason] = useState('');
  const { address, provider, chainId } = useWeb3();
  const [{}, dispatch] = useContextState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDispute = async () => {
    if (reason) {
      setLoading(true);
      await initializeDispute(chainId, provider, projectId, reason, txNotify);
      await getUserDetails(chainId,provider, address, dispatch);
      router.push(`/dispute/${projectId}`)
      setLoading(false);
    }
  }

  const txNotify = useCallback((type, title, txHash) => {
    TransactionToastMessage({ type, title, txHash });
  }, []);

  return (
    <>
    {loading && <Spinner />}
      <Transition appear show={modalStatus} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setModalStatus(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Mention the dispute reason.
                  </Dialog.Title>
                  <div className="mt-2">
                    <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Dispute Reason." className='mt-2 p-2' />
                  </div>
                    <div className="mt-4 flex justify-center flex-wrap gap-8">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-palatte4 px-4 py-2 text-sm font-medium text-white hover:bg-palatte2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleDispute}
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setModalStatus(false)}
                      >
                        Cancel
                      </button>
                    </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}